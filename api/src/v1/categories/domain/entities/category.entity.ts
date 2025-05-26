export class CategoryEntity {
    id: number;
    name: string;

    constructor(partial: Partial<CategoryEntity>) {
        Object.assign(this, partial);
    }
} 