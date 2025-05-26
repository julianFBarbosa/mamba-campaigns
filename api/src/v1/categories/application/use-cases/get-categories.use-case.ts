import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  async execute(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }
}

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  async execute(id: number): Promise<CategoryEntity | null> {
    return this.categoryRepository.findById(id);
  }
}
