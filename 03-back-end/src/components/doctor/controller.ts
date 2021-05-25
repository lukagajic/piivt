import BaseController from '../../common/BaseController';
import * as express from 'express';
import DoctorModel from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddDoctor, IAddDoctorValidator } from './dto/AddDoctor';
import { IEditDoctor, IEditDoctorValidator } from './dto/EditDoctor';

class DoctorController extends BaseController {

    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.services.doctorService.getAll());
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const doctorId: number = +id;

        if (doctorId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: DoctorModel | null | IErrorResponse = await this.services.doctorService.getById(doctorId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof DoctorModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }

    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const data = req.body;

        if (!IAddDoctorValidator(data)) {
            res.status(400).send(IAddDoctorValidator.errors);
            return;
        }

        const result: DoctorModel | IErrorResponse =  await this.services.doctorService.add(data as IAddDoctor);
        
        res.send(result);
    }

    async edit(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;
        const doctorId: number = +id;

        if (doctorId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        const data = req.body;

        if (!IEditDoctorValidator(data)) {
            res.status(400).send(IEditDoctorValidator.errors);
            return;
        }

        const result: DoctorModel | IErrorResponse = await this.services.doctorService.edit(doctorId, data as IEditDoctor);

        if (result === null) {
            res.sendStatus(404);
            return;
        }
    
        res.send(result);
    }
}

export default DoctorController;
