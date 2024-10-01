import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../repositories/check-ins-repository";

interface FecthUserCheckInsHistoryRequest {
    userId: string;
    page: number;
}

interface FecthUserCheckInsHistoryResponse {
    checkIns: CheckIn[]
}

export class FecthUserCheckInsHistoryService {
    constructor(
        private checkInsRepository: CheckInsRepository
    ) {}

    async execute(
        { 
            userId,
            page
        }: FecthUserCheckInsHistoryRequest): Promise<FecthUserCheckInsHistoryResponse> {

        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);
 
        return { 
            checkIns
         };

    }

}    
