import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { GetCategoriesUseCase, GetCategoryByIdUseCase } from '../application/use-cases/get-categories.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../application/use-cases/delete-category.use-case';

@Controller("v1/categories")
export class CategoriesController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly getCategoriesUseCase: GetCategoriesUseCase,
        private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
        private readonly updateCategoryUseCase: UpdateCategoryUseCase,
        private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    ) {}

    @Post()
    async create(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto) {
        try {
            return await this.createCategoryUseCase.execute(createCategoryDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async findAll() {
        return await this.getCategoriesUseCase.execute();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const category = await this.getCategoryByIdUseCase.execute(id);
        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return category;
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto) {
        const updatedCategory = await this.updateCategoryUseCase.execute(id, updateCategoryDto);
        if (!updatedCategory) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return updatedCategory;
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        const deleted = await this.deleteCategoryUseCase.execute(id);
        if (!deleted) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }
        return { success: true };
    }
} 