import * as express from 'express';
import ServiceController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.inteface';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class ServiceRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const serviceController: ServiceController = new ServiceController(resources);

        application.get(
            "/service/:id",
            AuthMiddleware.getVerifier("doctor"),
            serviceController.getById.bind(serviceController)
        );

        application.get(
            "/service",
            AuthMiddleware.getVerifier("doctor"),     
            serviceController.getAll.bind(serviceController)
        );
        
        application.get(
            "/category/:cid/service",
            AuthMiddleware.getVerifier("doctor"),
            serviceController.getAllInCategory.bind(serviceController)
        );

        application.post(
            "/service",
            AuthMiddleware.getVerifier("doctor"),
            serviceController.add.bind(serviceController)
        );
        
        application.put(
            "/service/:id",
            AuthMiddleware.getVerifier("doctor"), 
            serviceController.edit.bind(serviceController)
        );

        application.delete(
            "/service/:id",
            AuthMiddleware.getVerifier("doctor"), 
            serviceController.deleteById.bind(serviceController)
        );
    }
}
