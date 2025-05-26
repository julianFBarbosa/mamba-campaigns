import { Module } from '@nestjs/common';
import { CampaignsModule } from './campaigns/campaign.module';
import { CategoriesModule } from './categories/category.module';

@Module({
  imports: [CampaignsModule, CategoriesModule],
})
export class V1Module {} 