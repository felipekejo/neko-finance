import { Controller, All, Req, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from '../../auth/better-auth.config';
import { Public } from '../../auth/public';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('/api/auth')
@Public()
export class AuthController {
  @All('*')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Better Auth endpoints',
    description:
      'Handle all authentication related requests including sign-in, sign-up, sessions, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication request processed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const protocol =
        req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host =
        req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3333';
      const baseURL = `${protocol}://${host}`;

      // Create a proper Request object for Better Auth
      const authRequest = new globalThis.Request(baseURL + req.url, {
        method: req.method,
        headers: req.headers as any,
        body:
          req.method === 'GET' || req.method === 'HEAD'
            ? undefined
            : JSON.stringify(req.body),
      });

      const authResponse = await auth.handler(authRequest);

      // Set response status
      res.status(authResponse.status);

      // Set response headers
      authResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Send response body
      const responseBody = await authResponse.text();
      res.send(responseBody);
    } catch (error) {
      console.error('Better Auth error:', error);
      res.status(500).json({
        error: 'Authentication service error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
