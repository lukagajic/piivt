import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../common/BaseService';
import ServiceModel from './model';
import * as mysql2 from 'mysql2/promise';
import CategoryService from '../category/service';

import { IAddService } from './dto/AddService';
import { IEditService } from './dto/EditService';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.inteface';

class ServiceModelAdapterOptions implements IModelAdapterOptionsInterface {
    loadCategory: boolean = false;
}

// Malo je cudno ime klase, ali takav je naziv entiteta - usluga (service)
class ServiceService extends BaseService<ServiceModel> {

    protected async adaptModel(data: any, options: Partial<ServiceModelAdapterOptions>): Promise<ServiceModel> {
        const item: ServiceModel = new ServiceModel();

        item.serviceId = +(data?.service_id);
        item.name = data?.name;
        item.description = data?.description;
        item.price = +(data?.price);
        item.priceForChildren = +(data?.price_for_children);
        item.priceForSeniors = +(data?.price_for_seniors);
        item.categoryId = +(data?.category_id);
        item.isActive = +(data?.is_active) === 1;

        if (options.loadCategory && item.categoryId) {
            const result = await this.services.categoryService.getById(item.categoryId); 
            
            // TODO: razresiti zasto nije instanca CategoryModel-a
            //if (result instanceof CategoryModel) {
            item.category = result as CategoryModel;
            //}
        }

        return item;
    }

    public async getAll(
        options: Partial<ServiceModelAdapterOptions> = { }
    ): Promise<ServiceModel[] | IErrorResponse> {
        return await this.getAllFromTable<ServiceModelAdapterOptions>("service", options);

    }

    public async getById(serviceId: number, options: Partial<ServiceModelAdapterOptions> = { }): Promise<ServiceModel | null | IErrorResponse> {
        return await this.getByIdFromTable("service", serviceId, options);
    }

    public async getAllByCategoryId(categoryId: number, options: Partial<ServiceModelAdapterOptions> = { }): Promise<ServiceModel[] | IErrorResponse> {
        return await this.getAllByFieldNameFromTable("service", "category_id", categoryId, options);
    }

    public async add(data: IAddService, options: Partial<ServiceModelAdapterOptions> = {}): Promise<ServiceModel | IErrorResponse> {
        return new Promise<ServiceModel | IErrorResponse>(async resolve => {
            const sql: string = `
                INSERT
                    service
                SET
                    name = ?,
                    description = ?,
                    price = ?,
                    price_for_children = ?,
                    price_for_seniors = ?,
                    category_id = ?
            `;

            this.db.execute(sql, 
                [ 
                    data.name,
                    data.description,
                    data.price,
                    data.priceForChildren,
                    data.priceForSeniors,
                    data.categoryId
                ])
                .then(async result => {
                    const insertInfo: any = result[0];
                    
                    const newFeatureId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newFeatureId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }

    public async edit(serviceId: number, data: IEditService, options: Partial<ServiceModelAdapterOptions> = {}): Promise<ServiceModel | null | IErrorResponse> {
        const result = await this.getById(serviceId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof ServiceModel)) {
            return result;
        }

        return new Promise<ServiceModel | IErrorResponse>(async resolve => {
            const sql: string = `
                UPDATE
                    service
                SET
                    name = ?,
                    description = ?,
                    price = ?,
                    price_for_children = ?,
                    price_for_seniors = ?,
                    category_id = ?
                WHERE
                    service_id = ?;
            `;

            this.db.execute(sql, 
                [ 
                    data.name,
                    data.description,
                    data.price,
                    data.priceForChildren,
                    data.priceForSeniors,
                    data.categoryId,
                    serviceId
                ])
                .then(async result => {
                    resolve(await this.getById(serviceId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(serviceId: number): Promise<IErrorResponse> {
        return await this.deleteByIdFromTable("service", serviceId);
    }

}

export default ServiceService;
