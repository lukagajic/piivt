import * as express from 'express';
import CategoryService from './service';

class CategoryController {
    private categoryService: CategoryService;
    
    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.categoryService.getAll());
    }
}

export default CategoryController;
