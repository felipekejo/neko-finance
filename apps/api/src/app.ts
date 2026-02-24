import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { auth } from "./utils/auth";

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors)
// app.register(cookie);

// // CORS (se frontend for outro domínio/porta)
// app.register(cors, {
//   origin: true,
//   credentials: true,
// });

// Rotas do Better Auth
app.route({
  method: ["GET", "POST"],
  url: "/auth/*",
  async handler(request, reply) {
    return auth.handler(request.raw, reply.raw);
  },
});

app.post("/auth", async (request, reply) => {
  return auth.handler(request.raw);
})