import CategoryModel from '../../../03-back-end/src/components/category/model';
import api from '../api/api';

export default class CategoryService {
    public static getAll(): Promise<CategoryModel[]> {
        return new Promise<CategoryModel[]>(resolve => {
            api("get", "/category", "doctor")
            .then(res => {
                if (res?.status !== "ok") {
                    return resolve([]);
                }

                resolve(res.data as CategoryModel[]);
            });
        });
    }
}
