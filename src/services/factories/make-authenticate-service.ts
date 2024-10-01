import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "../register";

export function makeAuthenticateService() {
    const usersRepository = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRepository);

    return registerService;
}