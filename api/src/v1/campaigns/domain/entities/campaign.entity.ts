import { IsEnum } from "class-validator";
import { CampaignStatus as PrismaCampaignStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export { PrismaCampaignStatus as CampaignStatus };

export class CampaignEntity {
    @ApiProperty({
        description: 'The unique identifier of the campaign',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'The name of the campaign',
        example: 'Summer Sale 2023'
    })
    name: string;

    @ApiProperty({
        description: 'The status of the campaign',
        enum: PrismaCampaignStatus,
        example: PrismaCampaignStatus.ACTIVE
    })
    @IsEnum(PrismaCampaignStatus)
    status: PrismaCampaignStatus;

    @ApiProperty({
        description: 'The start date of the campaign',
        example: '2023-06-01T00:00:00.000Z'
    })
    startDate: Date;

    @ApiProperty({
        description: 'The end date of the campaign',
        example: '2023-08-31T23:59:59.000Z'
    })
    endDate: Date;

    @ApiProperty({
        description: 'The ID of the category this campaign belongs to',
        example: 1
    })
    categoryId: number;

    @ApiProperty({
        description: 'The date when the campaign was created',
        example: '2023-05-15T10:30:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'The date when the campaign was last updated',
        example: '2023-05-20T14:45:00.000Z'
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'The date when the campaign was soft deleted (null if not deleted)',
        example: null,
        nullable: true
    })
    deletedAt: Date | null;

    constructor(partial: Partial<CampaignEntity>) {
        Object.assign(this, partial);
        this.createdAt = new Date();
        this.updatedAt = new Date();
        
        // Check if startDate is after endDate
        if (this.startDate && this.endDate && this.startDate > this.endDate) {
            throw new Error('Start date must be before or equal to end date');
        }
        
        // Check if endDate is in the past
        if (this.endDate && this.endDate < new Date()) {
            this.status = PrismaCampaignStatus.EXPIRED;
        }
    }
}
