import VisitModel from '../../../03-back-end/src/components/visit/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';

interface IResult {
    success: boolean;
    message?: string;
}

export interface IEditVisit {
    services: {
        visitServiceId: number;
        visitId: number;
        serviceId: number;
        description: string;
    }[];
}

export default class VisitService {
    public static getAllByPatient(patientId: number): Promise<VisitModel[]> {
        return new Promise<VisitModel[]>(resolve => {
            api("get", "/visit/by-patient/" + patientId, "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }

                    return resolve([]);
                }

                resolve(res.data as VisitModel[]);
            });
        });
    }

    public static getVisitById(visitId: number): Promise<VisitModel | null> {
        return new Promise<VisitModel|null>(resolve => {
            api("get", "/visit/" + visitId, "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve(null);
                }
                resolve(res.data as VisitModel);
            });
        });
    }

    public static editVisit(visitId: number, data: IEditVisit): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("put", "/visit/" + visitId, "doctor", data)
            .then(res => {
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

                /* if (res?.data?.errorCode === 1062) {
                    return resolve({
                        success: false,
                        message: "Kategorija sa tim imenom već postoji.",
                    });
                } */
                return resolve({
                    success: true,
                });
            })
        });
    }
}