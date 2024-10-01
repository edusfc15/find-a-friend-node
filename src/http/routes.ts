import { FastifyInstance } from "fastify";
import { register } from "./controller/register";
import { prisma } from "@/lib/prisma";
import { authenticate } from "./controller/authenticate";

export async function appRoutes(app: FastifyInstance){
    app.post('/users' , register);
    app.post('/sessions' , authenticate);

    app.get('/users', async (request, reply) => {
        const users = await prisma.user.findMany();
        return reply.send(users);
    });
}