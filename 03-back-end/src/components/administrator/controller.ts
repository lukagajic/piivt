import BaseController from '../../common/BaseController';
import * as express from 'express';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import AdministratorModel from './model';
import { IAddAdministrator, IAddAdministratorValidator } from './dto/AddAdministrator';
import { IEditAdministrator, IEditAdministratorValidator } from './dto/EditAdministrator';

class AdministratorController extends BaseController {
    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.services.administratorService.getAll());
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const administratorId: number = +id;

        if (administratorId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: AdministratorModel | null | IErrorResponse = await this.services.administratorService.getById(administratorId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof AdministratorModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }

    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const data = req.body;

        if (!IAddAdministratorValidator(data)) {
            res.status(400).send(IAddAdministratorValidator.errors);
            return;
        }

        const result: AdministratorModel | IErrorResponse =  await this.services.administratorService.add(data as IAddAdministrator);
        
        res.send(result);
    }

    async edit(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;
        const administratorId: number = +id;

        if (administratorId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        const data = req.body;

        if (!IEditAdministratorValidator(data)) {
            res.status(400).send(IEditAdministratorValidator.errors);
            return;
        }

        const result: AdministratorModel | IErrorResponse = await this.services.administratorService.edit(administratorId, data as IEditAdministrator);

        if (result === null) {
            res.sendStatus(404);
            return;
        }
    
        res.send(result);
    }
}

export default AdministratorController;
