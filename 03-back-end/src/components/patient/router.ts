import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import PatientController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';

export default class PatientRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const patientController: PatientController = new PatientController(resources);

        application.get("/patient",     patientController.getAll.bind(patientController));
        application.get("/patient/:id", patientController.getById.bind(patientController));
        application.post("/patient",    patientController.add.bind(patientController));
        application.put("/patient/:id", patientController.edit.bind(patientController));
    }
}