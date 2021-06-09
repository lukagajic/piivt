import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import AuthController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class AuthRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const authController: AuthController = new AuthController(resources);

        application.post("/auth/doctor/login",        authController.doctorLogin.bind(authController));
        application.post("/auth/administrator/login", authController.administratorLogin.bind(authController));

        application.post("/auth/doctor/refresh", authController.doctorRefresh.bind(authController));
        application.post("/auth/administrator/refresh", authController.administratorRefresh.bind(authController));
    
        application.get("/auth/doctor/ok", AuthMiddleware.getVerifier("doctor"), authController.sendOk.bind(authController));
        application.get("/auth/administrator/ok", AuthMiddleware.getVerifier("administrator"), authController.sendOk.bind(authController));
    }
}
