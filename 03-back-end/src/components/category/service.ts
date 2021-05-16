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

    public async getAll(
        options: Partial<CategoryModelAdapterOptions> = { }
    ): Promise<CategoryModel[] | IErrorResponse> {
        return await this.getAllFromTable<CategoryModelAdapterOptions>("category", options);
    }

    public async getById(categoryId: number, options: Partial<CategoryModelAdapterOptions> = { }): Promise<CategoryModel | null | IErrorResponse> {
        return await this.getByIdFromTable<CategoryModelAdapterOptions>("category", categoryId, options);
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

    public async edit(categoryId: number, data: IEditCategory, options: Partial<CategoryModelAdapterOptions> = { }): Promise<CategoryModel | null | IErrorResponse> {
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
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    // TODO: Generalizovati ovu metodu u base service!
    public async delete(categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            const sql: string = "DELETE FROM category WHERE category_id = ?";

            this.db.execute(sql, [ categoryId ])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);

                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted!"
                        });
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record could not be deleted!"
                        }); 
                    }
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })

        });
    }
}

export default CategoryService;
