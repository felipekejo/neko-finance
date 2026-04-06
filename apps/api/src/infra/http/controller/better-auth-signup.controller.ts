import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from '../../auth/public';
import {
  BetterAuthService,
  CreateUserData,
  AuthenticateUserData,
} from '../../auth/better-auth.service';
import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type SignUpRequest = z.infer<typeof signUpSchema>;
type SignInRequest = z.infer<typeof signInSchema>;

@ApiTags('Better Auth')
@Controller('/better-auth')
@Public()
export class BetterAuthSignUpController {
  constructor(private betterAuthService: BetterAuthService) {}

  @Post('/sign-up')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Sign up a new user',
    description:
      'Create a new user account with email and password using Better Auth approach',
  })
  @ApiBody({
    description: 'User registration data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'João Silva',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'joao@example.com',
        },
        password: {
          type: 'string',
          minLength: 6,
          example: 'senha123',
        },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() body: any) {
    try {
      // Validate input
      const validatedData = signUpSchema.parse(body);

      // Create user using service
      const user = await this.betterAuthService.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        role: 'CLIENT',
      });

      return {
        success: true,
        user,
        message: 'User created successfully',
      };
    } catch (error) {
      console.error('Sign up error:', error);

      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation error',
          errors: error.errors,
        });
      }

      if (
        error instanceof Error &&
        error.message === 'User with this email already exists'
      ) {
        throw new ConflictException(error.message);
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Post('/sign-in')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Sign in user',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({
    description: 'User credentials',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'joao@example.com',
        },
        password: {
          type: 'string',
          example: 'senha123',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async signIn(@Body() body: any) {
    try {
      // Validate input
      const validatedData = signInSchema.parse(body);

      // Authenticate user using service
      const user = await this.betterAuthService.authenticateUser({
        email: validatedData.email,
        password: validatedData.password,
      });

      return {
        success: true,
        user,
        message: 'Authentication successful',
      };
    } catch (error) {
      console.error('Sign in error:', error);

      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          message: 'Validation error',
          errors: error.errors,
        });
      }

      if (
        error instanceof Error &&
        error.message === 'Invalid email or password'
      ) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException('Authentication failed');
    }
  }

  @Post('/check-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Check if email exists',
    description: 'Check if an email is already registered',
  })
  async checkEmail(@Body() body: { email: string }) {
    try {
      const exists = await this.betterAuthService.emailExists(body.email);

      return {
        exists,
        available: !exists,
      };
    } catch (error) {
      console.error('Check email error:', error);
      throw new InternalServerErrorException('Failed to check email');
    }
  }
}
