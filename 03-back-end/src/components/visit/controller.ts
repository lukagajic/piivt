import BaseController from '../../common/BaseController';
import * as express from 'express';
import VisitModel from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddVisit, IAddVisitValidator } from './dto/AddVisit';
import { IEditVisit, IEditVisitValidator } from './dto/EditVisit';

class VisitController extends BaseController {
    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.services.visitService.getAll({
            loadServices: true
        }));
    }

    async getAllActiveByPatientId(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const patientId: number = +id;

        if (patientId <= 0) {
            res.sendStatus(400);
            return;
        }
        
        res.send(await this.services.visitService.getAllActiveByPatientId(patientId, {
            loadServices: true,
            loadDoctor: true,
            loadEditorDoctor: true
        }));
    }

    async getActiveById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const visitId: number = +id;

        if (visitId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: VisitModel | null | IErrorResponse = await this.services.visitService.getActiveByVisitId(visitId, {
            loadServices: true,
            loadDoctor: true,
            loadEditorDoctor: true,
            loadPatient: true,
        });

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof VisitModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: string = req.params.id;

        const visitId: number = +id;

        if (visitId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: VisitModel | null | IErrorResponse = await this.services.visitService.getById(visitId, {
            loadServices: true
        });

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof VisitModel) {
            res.send(data);
            return;
        }
        
        res.status(500).send(data);
    }

    async add(req: express.Request, res: express.Response, next: express.NextFunction) {        
        const data = req.body;

        if (!IAddVisitValidator(data)) {
            res.status(400).send(IAddVisitValidator.errors);
            return;
        }

        const result: VisitModel | IErrorResponse = await this.services.visitService.add(data as IAddVisit);

        res.send(result);
    }

    async edit(req: express.Request, res: express.Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        if (!IEditVisitValidator(req.body)) {
            return res.status(400).send(IEditVisitValidator.errors);
        }
        
        // Za sada cemo editorDoctorId hardkodovati dok ne implementiramo autentifikaciju i autorizaciju
        const result = await this.services.visitService.edit(id, 1, req.body as IEditVisit);

        if (result === null) {
            return res.sendStatus(404);
        }

        res.send(result);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.visitService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(await this.services.visitService.deleteById(id));
    }
}

export default VisitController;
