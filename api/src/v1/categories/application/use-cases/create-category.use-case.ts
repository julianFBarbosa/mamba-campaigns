import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryData: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = new CategoryEntity(categoryData);
    return this.categoryRepository.create(category);
  }
} 