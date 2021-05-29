import VisitController from './controller';
import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';

export default class VisitRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const visitController: VisitController = new VisitController(resources);

        application.get("/visit",        visitController.getAll.bind(visitController));
        application.get("/visit/:id",    visitController.getById.bind(visitController));
        application.post("/visit",       visitController.add.bind(visitController));
        application.put("/visit/:id",    visitController.edit.bind(visitController));
        application.delete("/visit/:id", visitController.deleteById.bind(visitController));
    }
}
