import IModel from '../../common/IModel.interface';

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
}

export default PatientModel;
