import ServiceModel from '../../../03-back-end/src/components/service/model';
import EventRegister from '../api/EventRegister';
import api from '../api/api';



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

}
