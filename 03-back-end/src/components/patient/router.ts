import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import PatientController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class PatientRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const patientController: PatientController = new PatientController(resources);

        application.get(
            "/patient/gender",
            patientController.getAllGenderValues.bind(patientController)
        );

        application.get(
            "/patient/by-doctor",
            AuthMiddleware.getVerifier("doctor"),
            patientController.getAllByDoctor.bind(patientController)
        );

        application.get(
            "/patient",
            patientController.getAll.bind(patientController)
        );

        application.get(
            "/patient/:id",
            AuthMiddleware.getVerifier("doctor"),
            patientController.getById.bind(patientController)
        );

        application.post(
            "/patient",
            AuthMiddleware.getVerifier("doctor"),
            patientController.add.bind(patientController)
        );

        application.put(
            "/patient/:id",
            AuthMiddleware.getVerifier("doctor"),
            patientController.edit.bind(patientController)
        );
        
        application.delete(
            "/patient/:id",
            AuthMiddleware.getVerifier("doctor"),  
            patientController.deleteById.bind(patientController)
        );
    }
}