import * as express from 'express';
import CategoryService from './service';
import CategoryModel from './model';

class CategoryController {
    private categoryService: CategoryService;
    
    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.categoryService.getAll());
    }
    
    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const categoryId: number = +id;

        if (categoryId <= 0) {
            res.sendStatus(400);
            return;
        }

        const category: CategoryModel | null = await this.categoryService.getById(categoryId);

        if (category === null) {
            res.sendStatus(404);
            return;
        }

        res.send(category);
    }
}

export default CategoryController;
