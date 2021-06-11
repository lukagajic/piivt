import CategoryModel from '../../../03-back-end/src/components/category/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';

interface IResult {
    success: boolean;
    message?: string;
}

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

    public static editCategory(categoryId: number, newName: string): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("put", "/category/" + categoryId, "doctor", { name: newName })
            .then(res => {
                //if (res.status !== "ok") return resolve(false);
                //if (res.data?.errorCode !== undefined) return resolve(false);
                //resolve(true);
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
                        message: "Kategorija sa tim imenom već postoji.",
                    });
                }
                return resolve({
                    success: true,
                });
            })
        });
    }

    public static addNewCategory(name: string): Promise<IResult> {
        return new Promise<IResult>(resolve => {
            api("post", "/category", "administrator", { name: name })
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
                        message: "Kategorija sa tim imenom već postoji.",
                    });
                }
                return resolve({
                    success: true,
                });
            })
        });
    }
}
