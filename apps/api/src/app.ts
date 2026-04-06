import fastifyCors from "@fastify/cors";
import { toNodeHandler } from "better-auth/node";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from "./utils/auth";
import { CreateBudgetUseCase } from "./domain/use-cases/create-budget";
import { AssignBudgetUseCase } from "./domain/use-cases/assign-budget";
import { CreateCategoryUseCase } from "./domain/use-cases/create-category";
import { createBudgetRoute } from "./infra/http/routes/create-budget.route";
import { createCategoryRoute } from "./infra/http/routes/create-category.route";
export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors)

// Rotas do Better Auth
app.addContentTypeParser(
  ['application/json', 'application/x-www-form-urlencoded'],
  { parseAs: 'buffer' },
  (req, body, done) => done(null, body)
)

app.route({
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
});

app.register(createBudgetRoute)
app.register((fastify) => createCategoryRoute(fastify, new CreateCategoryUseCase(...)))