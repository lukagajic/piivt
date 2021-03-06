import IModel from '../../common/IModel.interface';
import PatientModel from '../patient/model';
import DoctorModel from '../doctor/model';
import ServiceModel from '../service/model';

class VisitServiceRecord implements IModel {
    visitServiceId?: number;
    visitId: number;
    serviceId: number;
    description: string;
    service?: ServiceModel;
}

class VisitModel implements IModel {
    visitId: number;
    visitedAt: Date;
    patientId: number;
    doctorId: number;
    editorDoctorId: number;
    patient: PatientModel;
    doctor: DoctorModel;
    editorDoctor: DoctorModel;
    services: VisitServiceRecord[];
    isActive: boolean;
    totalPrice: number;
}

export default VisitModel;
export { VisitServiceRecord };
