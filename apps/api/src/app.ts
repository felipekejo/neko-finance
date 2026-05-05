import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { env } from "./env";
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
import { getTransactionsSummaryRoute } from "./infra/http/routes/get-transactions-summary.route";
import { getTransactionsEvolutionRoute } from "./infra/http/routes/get-transactions-evolution.route";
import { importTransactionsRoute } from "./infra/http/routes/import-transactions.route";
import { assignBudgetRoute } from "./infra/http/routes/assign-budget.route";
import { createCategoryRoute } from "./infra/http/routes/create-category.route";
import { deleteCategoryRoute } from "./infra/http/routes/delete-category.route";
import { editCategoryRoute } from "./infra/http/routes/edit-category.route";
import { fetchCategoriesRoute } from "./infra/http/routes/fetch-categories.route";
import { getCategoryByIdRoute } from "./infra/http/routes/get-category-by-id.route";
import { createSubcategoryRoute } from "./infra/http/routes/create-subcategory.route";
import { deleteSubcategoryRoute } from "./infra/http/routes/delete-subcategory.route";
import { editSubcategoryRoute } from "./infra/http/routes/edit-subcategory.route";
import { fetchSubcategoriesRoute } from "./infra/http/routes/fetch-subcategories.route";
import { getSubcategoryByIdRoute } from "./infra/http/routes/get-subcategory-by-id.route";

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyHelmet)
app.register(fastifyCors, {
  origin: [env.CLIENT_ORIGIN],
  credentials: true,
})
app.register(fastifyRateLimit, {
  max: 200,
  timeWindow: '1 minute',
})
app.register(fastifyMultipart, {
  limits: { fileSize: 10 * 1024 * 1024 },
})

if (env.NODE_ENV !== 'prod') {
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
}

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
  protectedApp.register(getTransactionsSummaryRoute)
  protectedApp.register(getTransactionsEvolutionRoute)
  protectedApp.register(importTransactionsRoute)
  protectedApp.register(assignBudgetRoute)
  protectedApp.register(createCategoryRoute)
  protectedApp.register(deleteCategoryRoute)
  protectedApp.register(editCategoryRoute)
  protectedApp.register(fetchCategoriesRoute)
  protectedApp.register(getCategoryByIdRoute)
  protectedApp.register(createSubcategoryRoute)
  protectedApp.register(deleteSubcategoryRoute)
  protectedApp.register(editSubcategoryRoute)
  protectedApp.register(fetchSubcategoriesRoute)
  protectedApp.register(getSubcategoryByIdRoute)
})
