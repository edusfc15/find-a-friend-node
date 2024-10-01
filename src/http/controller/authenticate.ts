import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email , password} = registerBodySchema.parse(request.body);

    try {

        const registerService = makeAuthenticateService();

        await registerService.execute({name, email, password});
    }
    catch (error) {

        if (error instanceof UserAlreadyExistsError){
            return reply.status(409).send({ message: error.message });
        }
            
        throw error;
        
    }   

    return reply.status(201).send();

}