import { CategoryEntity } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract create(category: CategoryEntity): Promise<CategoryEntity>;
  abstract findAll(): Promise<CategoryEntity[]>;
  abstract findById(id: number): Promise<CategoryEntity | null>;
  abstract update(id: number, category: Partial<CategoryEntity>): Promise<CategoryEntity>;
  abstract delete(id: number): Promise<boolean>;
} 