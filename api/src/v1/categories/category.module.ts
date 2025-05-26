import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/category.controller';
import { CategoryRepository } from './domain/repositories/category.repository.interface';
import { CategoryRepositoryImpl } from './infrastructure/repositories/category.repository';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { GetCategoriesUseCase, GetCategoryByIdUseCase } from './application/use-cases/get-categories.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    CreateCategoryUseCase,
    GetCategoriesUseCase,
    GetCategoryByIdUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    PrismaService
  ],
})
export class CategoriesModule {} 