import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyAuth } from "./infra/http/middleware/verify-auth";
import { authRoute } from "./infra/http/routes/auth.route";
import { createBudgetRoute } from "./infra/http/routes/create-budget.route";
import { deleteBudgetRoute } from "./infra/http/routes/delete-budget.route";
import { getBudgetByIdRoute } from "./infra/http/routes/get-budget-by-id.route";

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


app.register(authRoute)

app.register(async (protectedApp) => {
  protectedApp.addHook('preHandler', verifyAuth)

  protectedApp.register(createBudgetRoute)
  protectedApp.register(getBudgetByIdRoute)
  protectedApp.register(deleteBudgetRoute)
})
