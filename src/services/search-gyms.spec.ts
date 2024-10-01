import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsService } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('search gyms service', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsService(gymsRepository);
    })


    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            
            title: 'Academia 01',
            description: 'Academia 01',
            phone: '123456789',
            latitude: -15.8331715,
            longitude: -47.7350994
        })

        await gymsRepository.create({
            title: 'Academia 02',
            description: 'Academia 01',
            phone: '123456789',
            latitude: -15.8331715,
            longitude: -47.7350994
        })

        const { gyms } = await sut.execute({
            query: 'Academia',
            page: 1
        })
        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({
                title: 'Academia 01',
            }),
            expect.objectContaining({
                title: 'Academia 02',
            }),
        ]);

    });

    it('should be able to fetch paginated gym search', async () => {

        for( let i = 1; i <= 22; i++) {
            await gymsRepository.create({
            
                title: `Academia ${i}`,
                description: 'Academia 01',
                phone: '123456789',
                latitude: -15.8331715,
                longitude: -47.7350994
            })
        }
        
        const { gyms } = await sut.execute({
            query: 'Academia',
            page: 2
        })
        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({
                title: 'Academia 21',
            }),
            expect.objectContaining({
                title: 'Academia 22',
            }),
        ]);

    });


});
