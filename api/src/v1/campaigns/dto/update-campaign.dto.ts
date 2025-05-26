import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateCampaignDto } from "./create-campaign.dto";
import { CampaignStatus } from "../domain/entities/campaign.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCampaignDto {
  @ApiProperty({
    description: 'The name of the campaign',
    example: 'Updated Summer Sale 2023',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The status of the campaign',
    enum: CampaignStatus,
    example: CampaignStatus.PAUSED,
    required: false
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiProperty({
    description: 'The ID of the category this campaign belongs to',
    example: 2,
    required: true
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: 'The start date of the campaign',
    example: '2023-07-01T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'The end date of the campaign',
    example: '2023-09-30T23:59:59.000Z',
    required: false
  })
  @IsOptional()
  endDate?: Date;
}
