import { auth } from "@/utils/auth";
import type { FastifyTypedInstance } from "@/utils/fastifyTypes";
import { toNodeHandler } from "better-auth/node";
import type { IncomingMessage } from "node:http";

export async function authRoute(app: FastifyTypedInstance) {
  app.addContentTypeParser(
    ['application/json', 'application/x-www-form-urlencoded'],
    { parseAs: 'buffer' },
    (req, body, done) => done(null, body)
  )

  app.route({
    method: ["GET", "POST"],
    url: "/auth/*",
    async handler(request, reply) {
      const req = request.raw as IncomingMessage & { body?: string }
      const body = request.body

      req.body = Buffer.isBuffer(body)
        ? body.toString('utf-8')
        : typeof body === 'string'
          ? body
          : JSON.stringify(body)

      return toNodeHandler(auth)(req, reply.raw)
    },
  })
}