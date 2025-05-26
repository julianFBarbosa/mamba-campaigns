import { Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CategoryRepositoryImpl extends CategoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    return this.prisma.category.create({
      data: category
    });
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.prisma.category.findMany();
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return this.prisma.category.findUnique({
      where: { id }
    });
  }

  async update(id: number, categoryData: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.prisma.category.update({
      where: { id },
      data: categoryData
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.prisma.category.delete({
      where: { id }
    });
    return !!result;
  }
} 