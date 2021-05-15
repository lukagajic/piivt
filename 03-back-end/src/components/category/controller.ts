import * as express from 'express';
import CategoryService from './service';
import CategoryModel from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';

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

        const data: CategoryModel | null | IErrorResponse = await this.categoryService.getById(categoryId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof CategoryController) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }
}

export default CategoryController;
