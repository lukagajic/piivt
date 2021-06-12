import IModel from '../../common/IModel.interface';
import DoctorModel from '../doctor/model';

class PatientModel implements IModel {
    patientId: number;
    forename: string;
    surname: string;
    bornAt: Date;
    gender: "male" | "female";
    email: string;
    personalIdentityNumber: string;
    phoneNumber: string;
    address: string;
    isActive: boolean;
    createdAt: Date;
    doctorId: number;
    doctor: DoctorModel | null = null;
}

export default PatientModel;
