import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { toNodeHandler } from "better-auth/node";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyAuth } from "./infra/http/middleware/verify-auth";
import { createBudgetRoute } from "./infra/http/routes/create-budget.route";
import { deleteBudgetRoute } from "./infra/http/routes/delete-budget";
import { getBudgetByIdRoute } from "./infra/http/routes/get-budget-by-id.route";
import { auth } from "./utils/auth";

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Neko Finance API',
      description: 'API para gerenciamento de orçamentos',
      version: '1.0.0'
    }
  }
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Better Auth - sem parsing automático do Fastif

app.register(async (authApp) => {
  authApp.addContentTypeParser(
    ['application/json', 'application/x-www-form-urlencoded'],
    { parseAs: 'buffer' },
    (req, body, done) => done(null, body)
  )

  authApp.route({
    method: ["GET", "POST"],
    url: "/auth/*",
    async handler(request, reply) {
      const req = request.raw;
      const body = request.body;
      (req as any).body = typeof body === 'string'
        ? body
        : Buffer.isBuffer(body)
          ? body.toString('utf-8')
          : JSON.stringify(body);
      return toNodeHandler(auth)(req, reply.raw);
    },
  })
})

app.register(async (protectedApp) => {
  protectedApp.addHook('preHandler', verifyAuth)

  protectedApp.register(createBudgetRoute)
  protectedApp.register(getBudgetByIdRoute)
  protectedApp.register(deleteBudgetRoute)
})
