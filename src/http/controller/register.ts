import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InvalidCredentialError } from "@/services/errors/invalid-credential-error";
import { makeRegisterService } from "@/services/factories/make-register-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { email , password} = authenticateBodySchema.parse(request.body);

    try {

        const authenticateService = makeRegisterService();

        await authenticateService.execute({email, password});
    }
    catch (error) {

        if (error instanceof InvalidCredentialError){
            return reply.status(400).send({ message: error.message });
        }
            
        throw error;
        
    }   

    return reply.status(200).send();

}