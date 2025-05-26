import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateCampaignUseCase } from './update-campaign.use-case';
import { CampaignRepositoryImpl } from '../../infrastructure/repositories/campaign.repository';
import { CategoryRepositoryImpl } from '../../../categories/infrastructure/repositories/category.repository';
import { CampaignEntity, CampaignStatus } from '../../domain/entities/campaign.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CampaignRepository } from '../../domain/repositories/campaign.repository.interface';
import { CategoryRepository } from '../../../categories/domain/repositories/category.repository.interface';

describe('UpdateCampaignUseCase', () => {
  let updateCampaignUseCase: UpdateCampaignUseCase;
  let campaignRepository: jest.Mocked<CampaignRepository>;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: {
            update: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: CategoryRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    updateCampaignUseCase = moduleRef.get<UpdateCampaignUseCase>(UpdateCampaignUseCase);
    campaignRepository = moduleRef.get(CampaignRepository) as jest.Mocked<CampaignRepository>;
    categoryRepository = moduleRef.get(CategoryRepository) as jest.Mocked<CategoryRepository>;
  });

  it('should update campaign successfully', async () => {
    // Arrange
    const campaignId = 1;
    const campaignData = {
      name: 'Updated Campaign',
      categoryId: 2,
    };
    
    const existingCampaign = new CampaignEntity({ 
      id: campaignId, 
      name: 'Original Campaign', 
      status: CampaignStatus.ACTIVE,
      categoryId: 1 
    });
    
    const category = { id: 2, name: 'New Category' };
    const updatedCampaign = new CampaignEntity({ 
      ...existingCampaign, 
      ...campaignData 
    });
    
    categoryRepository.findById.mockResolvedValue(category);
    campaignRepository.findById.mockResolvedValue(existingCampaign);
    campaignRepository.update.mockResolvedValue(updatedCampaign);

    // Act
    const result = await updateCampaignUseCase.execute(campaignId, campaignData);

    // Assert
    expect(categoryRepository.findById).toHaveBeenCalledWith(2);
    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
    expect(campaignRepository.update).toHaveBeenCalledWith(campaignId, campaignData);
    expect(result).toEqual(updatedCampaign);
  });

  it('should throw error if category not found', async () => {
    // Arrange
    const campaignId = 1;
    const campaignData = {
      categoryId: 999, // Non-existent category
    };
    
    categoryRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateCampaignUseCase.execute(campaignId, campaignData))
      .rejects
      .toThrow(new HttpException('Category not found', HttpStatus.BAD_REQUEST));
    
    expect(categoryRepository.findById).toHaveBeenCalledWith(999);
    expect(campaignRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error if campaign not found', async () => {
    // Arrange
    const campaignId = 999; // Non-existent campaign
    const campaignData = {
      name: 'Updated Campaign',
      categoryId: 1,
    };
    
    const category = { id: 1, name: 'Test Category' };
    
    categoryRepository.findById.mockResolvedValue(category);
    campaignRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateCampaignUseCase.execute(campaignId, campaignData))
      .rejects
      .toThrow(new HttpException('Campaign not found', HttpStatus.BAD_REQUEST));
    
    expect(categoryRepository.findById).toHaveBeenCalledWith(1);
    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
    expect(campaignRepository.update).not.toHaveBeenCalled();
  });
}); 