import * as express from 'express';
import ServiceController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.inteface';

export default class ServiceRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const serviceController: ServiceController = new ServiceController(resources);

        application.get("/service/:id",             serviceController.getById.bind(serviceController));
        application.get("/service",                 serviceController.getAll.bind(serviceController));
        application.get("/category/:cid/service",   serviceController.getAllInCategory.bind(serviceController));
        application.post("/service",                serviceController.add.bind(serviceController));
        application.put("/service/:id",             serviceController.edit.bind(serviceController));
        application.delete("/service/:id",          serviceController.deleteById.bind(serviceController));
    }
}
