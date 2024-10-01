import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateService } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialError } from './errors/invalid-credential-error';

describe('authenticate', () => {

    let usersRepository: InMemoryUsersRepository;
    let sut: AuthenticateService;

    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateService(usersRepository);
    })

    it('should authenticate user', async () => {


        await usersRepository.create({
            name: 'John Doe',
            email: 'jondoe@email.com',
            passwordHash: await hash('123456', 6)
        });

        const {user } = await sut.execute({
            email: 'jondoe@email.com',
            password: '123456'
        })
        expect(user.id).toEqual(expect.any(String));
        
    });

    it('should not be able to authenticate with wrong email', async () => {

        await expect(() => 
            sut.execute({
            email: 'jondoe@email.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialError);

    });

    it('should not be able to authenticate with wrong password', async () => {

        await usersRepository.create({
            name: 'John Doe',
            email: 'jondoe@email.com',
            passwordHash: await hash('123456', 6)
        });


        await expect(() => 
            sut.execute({
            email: 'jondoe@email.com',
            password: '123457'
        })).rejects.toBeInstanceOf(InvalidCredentialError);

    });



});
