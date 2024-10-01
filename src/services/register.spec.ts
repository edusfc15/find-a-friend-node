import { expect, describe, it, beforeEach } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterService } from './register';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe('register', () => {

    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterService(usersRepository)
    })

    it('should register a new user', async () => {

        const {user } = await sut.execute({
            name: 'John Doe',
            email: 'jondoe@email.com',
            password: '123456'
        })
        expect(user.id).toEqual(expect.any(String));
        
    });

    it('should hash user password upon registration', async () => {

        const user = await sut.execute({
            name: 'John Doe',
            email: '',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.user.passwordHash);

        expect(isPasswordCorrectlyHashed).toBe(true);

    });

    it('should not allow two users with the same email', async () => {

            const email = 'jondoe@email.com';
    
            await sut.execute({
                name: 'John Doe',
                email,
                password: '123456'
            })

            await expect( () => 
                sut.execute({
                    name: 'John Doe',
                    email,
                    password: '123456'
                })
            ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    })

});
