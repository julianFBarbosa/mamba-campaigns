import { CampaignEntity, CampaignStatus } from './campaign.entity';

describe('CampaignEntity', () => {
  it('should create a campaign with default values', () => {
    const campaign = new CampaignEntity({
      name: 'Test Campaign',
      status: CampaignStatus.ACTIVE,
      categoryId: 1,
      deletedAt: null
    });

    expect(campaign.name).toBe('Test Campaign');
    expect(campaign.status).toBe(CampaignStatus.ACTIVE);
    expect(campaign.categoryId).toBe(1);
    expect(campaign.createdAt).toBeInstanceOf(Date);
    expect(campaign.updatedAt).toBeInstanceOf(Date);
    expect(campaign.deletedAt).toBeNull();
  });

  it('should set status to EXPIRED if endDate is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const campaign = new CampaignEntity({
      name: 'Past Campaign',
      status: CampaignStatus.ACTIVE,
      categoryId: 1,
      startDate: new Date(pastDate.getTime() - 86400000),
      endDate: pastDate
    });

    expect(campaign.status).toBe(CampaignStatus.EXPIRED);
  });

  it('should throw error if startDate is after endDate', () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() - 86400000); // 1 day before startDate

    expect(() => {
      new CampaignEntity({
        name: 'Invalid Campaign',
        status: CampaignStatus.ACTIVE,
        categoryId: 1,
        startDate,
        endDate
      });
    }).toThrow('Start date must be before or equal to end date');
  });
}); 