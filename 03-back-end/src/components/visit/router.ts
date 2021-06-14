import VisitController from './controller';
import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class VisitRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const visitController: VisitController = new VisitController(resources);

        application.get("/visit/by-patient/:id", AuthMiddleware.getVerifier("doctor"), visitController.getAllActiveByPatientId.bind(visitController));
        application.get("/visit",                AuthMiddleware.getVerifier("administrator"), visitController.getAll.bind(visitController));
        application.get("/visit/:id",            AuthMiddleware.getVerifier("administrator"), visitController.getActiveById.bind(visitController));
        application.post("/visit",               AuthMiddleware.getVerifier("doctor"), AuthMiddleware.getVerifier("doctor"), visitController.add.bind(visitController));
        application.put("/visit/:id",            AuthMiddleware.getVerifier("doctor"), AuthMiddleware.getVerifier("doctor"), visitController.edit.bind(visitController));
        application.delete("/visit/:id",         AuthMiddleware.getVerifier("doctor"), AuthMiddleware.getVerifier("doctor"), visitController.deleteById.bind(visitController));
    }
}
