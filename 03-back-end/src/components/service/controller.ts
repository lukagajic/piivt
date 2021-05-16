import ServiceService from './service';
import * as express from 'express';
import ServiceModel from './model';
import IErrorResponse from '../../../dist/common/IErrorResponse.inteface';
import { IAddService, IAddServiceValidator } from './dto/AddService';
import { IEditService, IEditServiceValidator } from './dto/EditService';

export default class ServiceController {
    private serviceService: ServiceService;

    constructor(serviceService: ServiceService) {
        this.serviceService = serviceService;
    }

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.serviceService.getAll({
            loadCategory: true
        }));
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const serviceId: number = +id;

        if (serviceId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: ServiceModel | null | IErrorResponse = await this.serviceService.getById(serviceId, {
            loadCategory: true
        });

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof ServiceModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }

    async getAllInCategory(req: express.Request, res: express.Response, next: express.NextFunction) {
        const categoryId: number = +(req.params.cid);

        res.send(await this.serviceService.getAllByCategoryId(categoryId));
    }

    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const data = req.body;

        if (!IAddServiceValidator(data)) {
            res.status(400).send(IAddServiceValidator.errors);
            return;
        }

        const result: ServiceModel | IErrorResponse =  await this.serviceService.add(data as IAddService, {
            loadCategory: true
        });
        
        res.send(result);
    }

    async edit(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;
        const serviceId: number = +id;

        if (serviceId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        const data = req.body;

        if (!IEditServiceValidator(data)) {
            res.status(400).send(IEditServiceValidator.errors);
            return;
        }

        const result: ServiceModel | IErrorResponse = await this.serviceService.edit(serviceId, data as IEditService, {
            loadCategory: true
        });

        if (result === null) {
            res.sendStatus(404);
            return;
        }
    
        res.send(result);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;
        const serviceId: number = +id;

        if (serviceId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        res.send(await this.serviceService.delete(serviceId));
    }
}
