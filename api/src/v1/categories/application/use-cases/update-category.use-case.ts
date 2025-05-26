import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number, categoryData: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryRepository.update(id, categoryData);
  }
} 