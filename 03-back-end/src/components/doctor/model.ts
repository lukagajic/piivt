import IModel from '../../common/IModel.interface';

class DoctorModel implements IModel {
    doctorId: number;
    forename: string;
    surname: string;
    email: string;
    username: string;

    /*
        Ovde je passwordHash stavljen sa upitnikom,
        jer ne zelimo ni u kom slucaju da na front-end
        vracamo podatak o password-u doctora
        cak i u slucaju da je on hesovan
    */
    passwordHash?: string;
    bornAt: Date;
    gender: "male" | "female";
    title: "magistar" | "specijalizant" | "doktor" | "docent" | "primarijus";
    phoneNumber: string;
}

export default DoctorModel;
