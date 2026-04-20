import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyAuth } from "./infra/http/middleware/verify-auth";
import { authRoute } from "./infra/http/routes/auth.route";
import { createAccountRoute } from "./infra/http/routes/create-account.route";
import { createBudgetRoute } from "./infra/http/routes/create-budget.route";
import { deleteAccountRoute } from "./infra/http/routes/delete-account.route";
import { deleteBudgetRoute } from "./infra/http/routes/delete-budget.route";
import { editAccountRoute } from "./infra/http/routes/edit-account.route";
import { fetchAccountsRoute } from "./infra/http/routes/fetch-accounts.route";
import { getAccountByIdRoute } from "./infra/http/routes/get-account-by-id.route";
import { getBudgetByIdRoute } from "./infra/http/routes/get-budget-by-id.route";
import { createTransactionRoute } from "./infra/http/routes/create-transaction.route";
import { deleteTransactionRoute } from "./infra/http/routes/delete-transaction.route";
import { editTransactionRoute } from "./infra/http/routes/edit-transaction.route";
import { fetchTransactionsRoute } from "./infra/http/routes/fetch-transactions.route";
import { getTransactionByIdRoute } from "./infra/http/routes/get-transaction-by-id.route";

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

  protectedApp.register(createAccountRoute)
  protectedApp.register(deleteAccountRoute)
  protectedApp.register(editAccountRoute)
  protectedApp.register(fetchAccountsRoute)
  protectedApp.register(getAccountByIdRoute)
  protectedApp.register(createBudgetRoute)
  protectedApp.register(getBudgetByIdRoute)
  protectedApp.register(deleteBudgetRoute)
  protectedApp.register(createTransactionRoute)
  protectedApp.register(deleteTransactionRoute)
  protectedApp.register(editTransactionRoute)
  protectedApp.register(fetchTransactionsRoute)
  protectedApp.register(getTransactionByIdRoute)
})
