import CategoryModel from "./model";
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddCategory } from "./dto/AddCategory";
import BaseService from '../../common/BaseService';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IEditCategory } from "./dto/EditCategory";
import ServiceModel from '../service/model';


// Iako ovo za sada i nije potrebno, u slucaju buducih prosirenja moze da ostane
class CategoryModelAdapterOptions implements IModelAdapterOptions {
    loadServices: boolean;
}

class CategoryService extends BaseService<CategoryModel> {
    
    
    protected async adaptModel(row: any, options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        item.isActive = +(row?.is_active) === 1;

        if (options.loadServices) {
            item.services = await this.services.serviceService.getAllByCategoryId(item.categoryId) as ServiceModel[];
        }
        
        return item;
    }

    public async getAll(
        options: Partial<CategoryModelAdapterOptions> = { }
    ): Promise<CategoryModel[] | IErrorResponse> {
        return await this.getAllFromTable<CategoryModelAdapterOptions>("category", options);
    }

    public async getAllActive(
        options: Partial<CategoryModelAdapterOptions> = { }
    ): Promise<CategoryModel[] | IErrorResponse> {
        return await this.getAllActiveFromTable<CategoryModelAdapterOptions>("category", options);
    }

    public async getById(categoryId: number, options: Partial<CategoryModelAdapterOptions> = { }): Promise<CategoryModel | null | IErrorResponse> {
        return await this.getActiveByIdFromTable<CategoryModelAdapterOptions>("category", categoryId, options);
    }

    public async add(data: IAddCategory): Promise<CategoryModel | IErrorResponse > {
        return new Promise<CategoryModel | IErrorResponse>(async resolve => {
            const sql: string = 
            `
                INSERT category 
                SET
                    name = ?
                ON DUPLICATE KEY
                UPDATE
                    is_active = 1
            ;`;

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

    public async delete(categoryId: number): Promise<IErrorResponse> {
        return await this.deleteByIdFromTable("category", categoryId);
    }
}

export default CategoryService;
