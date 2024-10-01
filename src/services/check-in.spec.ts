import { expect, describe, it, afterEach, beforeEach, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckinService } from './check-in';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error';
import { MaxDistanceError } from './errors/max-distance-error';


let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinService;

describe('check-in service', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckinService(checkInsRepository,gymsRepository);

        await gymsRepository.create({
            id: 'gym-01',
            title: 'Academia 01',
            description: 'Academia 01',
            phone: '123456789',
            latitude: new Decimal(0),
            longitude: new Decimal(0)
        })

        vi.useFakeTimers();
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it('should be able to check in', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })
        expect(checkIn.id).toEqual(expect.any(String));

    });

    it('should not be able to check in twice in the same day', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        await expect(sut.execute(
            {
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0
            })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);

    });

    it('should be able to check in twice but in different days', async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute(
            {
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0
            });

        expect(checkIn.id).toEqual(expect.any(String));

    });

    it('should not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Academia 01',
            description: 'Academia 01',
            phone: '123456789',
            latitude: new Decimal(-15.8331715),
            longitude: new Decimal(-47.7350994)
        })

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -15.8440744,
            userLongitude: -48.0266071
        })).rejects.toBeInstanceOf(MaxDistanceError);

    });





});
