import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AuthController from './controller';

export default class AuthRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const authController: AuthController = new AuthController(resources);

        application.post("/auth/doctor/login",        authController.doctorLogin.bind(authController));
        application.post("/auth/administrator/login", authController.administratorLogin.bind(authController));
    }
}
