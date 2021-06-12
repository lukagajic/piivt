import PatientModel from '../../../03-back-end/src/components/patient/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';

interface IResult {
    success: boolean;
    message?: string;
}


export interface IAddPatient {
    forename: string;
    surname: string;
    bornAt: string;
    gender: "male" | "female";
    email: string;
    personalIdentityNumber: string;
    phoneNumber: string;
    address: string;
}

export default class PatientService {
    public static getAllForDoctor(): Promise<PatientModel[]> {
        return new Promise<PatientModel[]>(resolve => {
            api("get", "/patient/by-doctor", "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }

                    return resolve([]);
                }

                resolve(res.data as PatientModel[]);
            });
        });
    }

    public static addPatient(data: IAddPatient): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("post", "/patient", "doctor", data)
            .then(res => {
                console.log("RES: ", res);
                if (res?.status === "error") {
                    if (Array.isArray(res?.data?.data)) {
                        const field = res?.data?.data[0]?.instancePath.replace('/', '');
                        const msg   = res?.data?.data[0]?.message;
                        const error = field + " " + msg;
                        return resolve({
                            success: false,
                            message: error,
                        });
                    }
                }

                if (res?.data?.errorCode === 1062) {
                    if ((res?.data?.errorMessage as string).includes("uq_patient_email")) {
                        return resolve({
                            success: false,
                            message: "Pacijent sa unetom e-mail adresom već postoji!"
                        });
                    }

                    if ((res?.data?.errorMessage as string).includes("uq_patient_personal_identity_number")) {
                        return resolve({
                            success: false,
                            message: "Pacijent sa unetim JMBG već postoji!"
                        });
                    }

                    if ((res?.data?.errorMessage as string).includes("uq_patient_phone_number")) {
                        return resolve({
                            success: false,
                            message: "Pacijent sa unetim brojem telefona već postoji!"
                        });
                    }

                    return resolve({
                        success: false,
                        message: res?.data?.errorMessage,
                    });
                }
                return resolve({
                    success: true,
                });
            })
        });        
    }

    public static getGenders(): Promise<string[]> {
        return new Promise<string[]>(resolve => {
            api("get", "/patient/gender", "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }

                    return resolve([]);
                }

                resolve(res.data as string[]);
            });
        });
    }
}