import BaseController from '../../common/BaseController';
import * as express from 'express';
import VisitModel, { VisitServiceRecord } from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddVisit, IAddVisitValidator } from './dto/AddVisit';
import { IEditVisit, IEditVisitValidator } from './dto/EditVisit';
import PatientModel from '../patient/model';

class VisitController extends BaseController {
    async getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send(await this.services.visitService.getAll({
            loadServices: true
        }));
    }

    async getAllActiveByPatientId(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.authorized?.id) {
            res.status(403).send("Nema identifikatora!");
            return;
        }
        
        const id: string = req.params.id;

        const patientId: number = +id;

        if (patientId <= 0) {
            res.sendStatus(400);
            return;
        }

        const patientData = await this.services.patientService.getById(patientId);

        if (patientData === null) {
            return res.sendStatus(404);
        }

        if ((patientData as PatientModel).doctorId !== req.authorized.id) {
            return res.status(403).send("Ovo nije vaš pacijent!");
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
        if (!req.authorized?.id) {
            res.status(403).send("Nema identifikatora!");
            return;
        }

        const data = req.body;

        if (!IAddVisitValidator(data)) {
            res.status(400).send(IAddVisitValidator.errors);
            return;
        }

        const validData = data as IAddVisit;

        const patientId: number = validData.patientId;

        if (patientId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }

        const patientData: PatientModel | null | IErrorResponse = await this.services.patientService.getById(patientId);

        if (patientData === null) {
            res.sendStatus(404);
            return;
        }

        if (patientData instanceof PatientModel) {
            if (patientData.doctorId !== req?.authorized.id) {
                return res.status(403).send("Ovo nije vaš pacijent!");
            }

            
            const result: VisitModel | IErrorResponse = await this.services.visitService.add(req.authorized.id, data as IAddVisit);
            res.send(result);
        }        
    }

    async edit(req: express.Request, res: express.Response) {
        if (!req.authorized?.id) {
            res.status(403).send("Nema identifikatora!");
            return;
        }

        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        if (!IEditVisitValidator(req.body)) {
            return res.status(400).send(IEditVisitValidator.errors);
        }
        
        const visitData: VisitModel | null | IErrorResponse = await this.services.visitService.getById(id);

        if (visitData === null) {
            return res.sendStatus(404);
        }

        if (!(visitData instanceof VisitModel)) {
            return res.send(visitData);
        }

        for (const visitService of (req.body as IEditVisit).services) {
            if (visitService.visitId !== (visitData as VisitModel).visitId) {
                return res.status(400).send("Ne možete promeniti posetu");
            }
        }

        if (visitData.doctorId !== req?.authorized.id) {
            return res.status(403).send("Ovo nije vaša poseta!");
        }

        const result = await this.services.visitService.edit(id, req.authorized.id, req.body as IEditVisit);

        if (result === null) {
            return res.sendStatus(404);
        }

        res.send(result);
    }

    async deleteById(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.authorized?.id) {
            res.status(403).send("Nema identifikatora!");
            return;
        }


        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.visitService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        if ((item as VisitModel).doctorId !== req?.authorized.id) {
            return res.status(403).send("Ovo nije vaša poseta!");
        }

        res.send(await this.services.visitService.deleteById(id));
    }
}

export default VisitController;
