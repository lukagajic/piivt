import ServiceModel from '../../../03-back-end/src/components/service/model';
import EventRegister from '../api/EventRegister';
import api from '../api/api';

export interface IAddService {
    name: string;
    description: string;
    price: number;
    priceForChildren: number;
    priceForSeniors: number;
    categoryId: number;
}

interface IResult {
    success: boolean;
    message?: string;
}

export interface IEditService {
    name: string;
    description: string;
    price: number;
    priceForChildren: number;
    priceForSeniors: number;
    categoryId: number;
}

export default class ServiceService {
    public static getAll(): Promise<ServiceModel[]> {
        return new Promise<ServiceModel[]>(resolve => {
            api("get", "/service", "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }

                    return resolve([]);
                }

                resolve(res.data as ServiceModel[]);
            });
        });
    }
    
    public static addService(data: IAddService): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            api("post", "/service", "doctor", data)
            .then(res => {
                if (res.status !== "ok") return resolve(false);
                if (res.data?.errorCode !== undefined) return resolve(false);
                resolve(true);
            })
        });
    }

    public static getServiceById(serviceId: number): Promise<ServiceModel | null> {
        return new Promise<ServiceModel|null>(resolve => {
            api("get", "/service/" + serviceId, "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve(null);
                }
                resolve(res.data as ServiceModel);
            });
        });
    }

    public static deleteService(serviceId: number): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            api("delete", "/service/" + serviceId, "doctor")
            .then(res => {
                if (res.status !== "ok") return resolve(false);
                if (res.data?.errorCode !== 0) return resolve(false);
                resolve(true);
            });
        });
    }

    public static editService(serviceId: number, data: IEditService): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("put", "/service/" + serviceId, "doctor", data)
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

                if (res?.data?.errorCode === 1062) {
                    return resolve({
                        success: false,
                        message: "Servis sa unetim imenom već postoji!",
                    });
                }

                return resolve({
                    success: true,
                });
            })
        });
    }
}
