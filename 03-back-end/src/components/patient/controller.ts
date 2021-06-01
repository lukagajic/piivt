import BaseController from '../../common/BaseController';
import * as express from 'express';
import PatientModel from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddPatient, IAddPatientValidator } from './dto/AddPatient';
import { IEditPatient, IEditPatientValidator } from './dto/EditPatient';

class PatientController extends BaseController {
    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.services.patientService.getAll());
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const patientId: number = +id;

        if (patientId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: PatientModel | null | IErrorResponse = await this.services.patientService.getById(patientId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof PatientModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }

    async add(req: express.Request, res: express.Response, next: express.NextFunction) {
        const data = req.body;

        if (!IAddPatientValidator(data)) {
            res.status(400).send(IAddPatientValidator.errors);
            return;
        }

        const result: PatientModel | IErrorResponse =  await this.services.patientService.add(data as IAddPatient);
        
        res.send(result);
    }

    async edit(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;
        const patientId: number = +id;

        if (patientId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        const data = req.body;

        if (!IEditPatientValidator(data)) {
            res.status(400).send(IEditPatientValidator.errors);
            return;
        }

        const result: PatientModel | IErrorResponse = await this.services.patientService.edit(patientId, data as IEditPatient);

        if (result === null) {
            res.sendStatus(404);
            return;
        }
    
        res.send(result);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;
        const patientId: number = +id;

        if (patientId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        res.send(await this.services.patientService.delete(patientId));
    }
}

export default PatientController;
