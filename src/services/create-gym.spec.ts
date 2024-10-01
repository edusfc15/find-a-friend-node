import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymService } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe('register', () => {

    beforeEach(()=>{
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymService(gymsRepository)
    })

    it('should be able to create a gym', async () => {

        const { gym } = await sut.execute({
            title: 'Academia 01',
            description: 'Academia 01',
            phone: '123456789',
            latitude: -15.8331715,
            longitude: -47.7350994
            
        })
        expect(gym.id).toEqual(expect.any(String));
        
    });

});
