import CategoryModel from '../../../03-back-end/src/components/category/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';

export default class CategoryService {
    public static getAll(): Promise<CategoryModel[]> {
        return new Promise<CategoryModel[]>(resolve => {
            api("get", "/category", "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }

                    return resolve([]);
                }

                resolve(res.data as CategoryModel[]);
            });
        });
    }
}
