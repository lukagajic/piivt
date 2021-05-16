import CategoryModel from "./model";
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddCategory } from "./dto/AddCategory";
import BaseService from '../../services/BaseService';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IEditCategory } from "./dto/EditCategory";


// Iako ovo za sada i nije potrebno, u slucaju buducih prosirenja moze da ostane
class CategoryModelAdapterOptions implements IModelAdapterOptions {

}

class CategoryService extends BaseService<CategoryModel> {
    
    protected async adaptModel(row: any, options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        
        return item;
    }

    public async getAll(): Promise<CategoryModel[] | IErrorResponse> {
        return await this.getAllFromTable<CategoryModelAdapterOptions>("category");
    }

    public async getById(categoryId: number): Promise<CategoryModel | null | IErrorResponse> {
        return await this.getByIdFromTable<CategoryModelAdapterOptions>("category", categoryId);
        
    }

    public async add(data: IAddCategory): Promise<CategoryModel | IErrorResponse > {
        return new Promise<CategoryModel | IErrorResponse>(async resolve => {
            const sql: string = "INSERT category SET name = ?;";

            this.db.execute(sql, [ data.name ])
                .then(async result => {
                    const insertInfo: any = result[0];
                    
                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newCategoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }

    public async edit(categoryId: number, data: IEditCategory): Promise<CategoryModel | null | IErrorResponse> {
        const result = await this.getById(categoryId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }

        return new Promise<CategoryModel | IErrorResponse>(async resolve => {
            const sql: string = "UPDATE category SET name = ? WHERE category_id = ?;";

            this.db.execute(sql, [ data.name, categoryId ])
                .then(async result => {
                    resolve(await this.getById(categoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
}

export default CategoryService;
