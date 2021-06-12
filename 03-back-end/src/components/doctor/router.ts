import IRouter from '../../common/IRouter.inteface';
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import DoctorController from './controller';
import AuthMiddleware from '../../middleware/auth.middleware';

export default class DoctorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const doctorController: DoctorController = new DoctorController(resources);

        application.get(
            "/doctor",
            doctorController.getAll.bind(doctorController)
        );

        application.get(
            "/doctor/:id",
            doctorController.getById.bind(doctorController)
        );

        application.post(
            "/doctor",
            doctorController.add.bind(doctorController)
        );

        application.put(
            "/doctor/:id",
            doctorController.edit.bind(doctorController)
        );
        
        application.delete(
            "/doctor/:id",
            doctorController.deleteById.bind(doctorController)
        );
    }
}