import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number): Promise<boolean> {
    return this.categoryRepository.delete(id);
  }
} 