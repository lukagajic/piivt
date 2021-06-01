import IModel from '../../common/IModel.interface';
import PatientModel from '../patient/model';
import DoctorModel from '../doctor/model';
import ServiceModel from '../service/model';

class Service implements IModel {
    serviceId: number;
    description: string;
    service?: ServiceModel;
}

class VisitModel implements IModel {
    visitId: number;
    createdAt: Date;
    description: string;
    patientId: number;
    doctorId: number;
    editorDoctorId: number;
    patient: PatientModel;
    doctor: DoctorModel;
    editorDoctor: DoctorModel;
    services: Service[];
    isActive: boolean;
    totalPrice: number;
}

export default VisitModel;
export { Service as VisitServiceRecord };
