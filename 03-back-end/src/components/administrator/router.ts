import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AdministratorController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class AdministratorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const administratorController: AdministratorController = new AdministratorController(resources);

        application.get("/administrator",        AuthMiddleware.getVerifier("administrator"), administratorController.getAll.bind(administratorController));
        application.get("/administrator/:id",    AuthMiddleware.getVerifier("administrator"), administratorController.getById.bind(administratorController));
        application.post("/administrator",       AuthMiddleware.getVerifier("administrator"), administratorController.add.bind(administratorController));
        application.put("/administrator/:id",    AuthMiddleware.getVerifier("administrator"), administratorController.edit.bind(administratorController));
        application.delete("/administrator/:id", AuthMiddleware.getVerifier("administrator"), administratorController.deleteById.bind(administratorController));
    }
}
