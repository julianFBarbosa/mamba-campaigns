import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CampaignStatus } from "../domain/entities/campaign.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCampaignDto {
    @ApiProperty({
        description: 'The name of the campaign',
        example: 'Summer Sale 2023'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The status of the campaign',
        enum: CampaignStatus,
        example: CampaignStatus.ACTIVE
    })
    @IsNotEmpty()
    @IsEnum(CampaignStatus)
    status: CampaignStatus;

    @ApiProperty({
        description: 'The ID of the category this campaign belongs to',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @ApiProperty({
        description: 'The start date of the campaign',
        example: '2023-06-01T00:00:00.000Z'
    })
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @ApiProperty({
        description: 'The end date of the campaign',
        example: '2023-08-31T23:59:59.000Z'
    })
    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
}
