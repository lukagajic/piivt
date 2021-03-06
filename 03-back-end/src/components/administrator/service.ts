import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import AdministratorModel from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddAdministrator } from './dto/AddAdministrator';
import { IEditAdministrator } from './dto/EditAdministrator';
import * as bcrypt from 'bcrypt';

class AdministratorModelAdapterOptions implements IModelAdapterOptionsInterface {

}

class AdministratorService extends BaseService<AdministratorModel> {
    protected async adaptModel(data: any, options: Partial<IModelAdapterOptionsInterface>): Promise<AdministratorModel> {
        const item: AdministratorModel = new AdministratorModel();

        item.administratorId = +(data?.administrator_id);
        item.username = data?.username;
        item.passwordHash = data?.password_hash;
        item.isActive = +(data?.is_active) === 1;

        return item;
    }

    public async getAll(
        options: Partial<AdministratorModelAdapterOptions> = { }
    ): Promise<AdministratorModel[] | IErrorResponse> {
        return await this.getAllFromTable<AdministratorModelAdapterOptions>("administrator", options) as AdministratorModel[];
    }

    public async getAllActive(
        options: Partial<AdministratorModelAdapterOptions> = { }
    ): Promise<AdministratorModel[] | IErrorResponse> {
        return await this.getAllActiveFromTable("administrator");
    }

    public async getById(administratorId: number, options: Partial<AdministratorModelAdapterOptions> = { }): Promise<AdministratorModel | null | IErrorResponse> {
        return await this.getByIdFromTable<AdministratorModelAdapterOptions>("administrator", administratorId, options);
    }

    public async add(data: IAddAdministrator): Promise<AdministratorModel | IErrorResponse > {
        return new Promise<AdministratorModel | IErrorResponse>(async resolve => {
            const sql: string = `
                INSERT
                    administrator
                SET
                    username = ?,
                    password_hash = ?;
            `;

            this.db.execute(sql, [
               data.username,
               bcrypt.hashSync(data.password, 11)
             ])
                .then(async result => {
                    const insertInfo: any = result[0];
                    
                    const newAdministratorId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newAdministratorId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }

    public async edit(administratorId: number, data: IEditAdministrator, options: Partial<AdministratorModelAdapterOptions> = { }): Promise<AdministratorModel | null | IErrorResponse> {
        const result: AdministratorModel | IErrorResponse = await this.getById(administratorId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof AdministratorModel)) {
            return result;
        }

        return new Promise<AdministratorModel | IErrorResponse>(async resolve => {
            const sql: string = `
                UPDATE
                    administrator
                SET
                    password_hash = ?
                WHERE
                    administrator_id = ?;
            `;
            
            this.db.execute(sql, [ 
                bcrypt.hashSync(data.password, 11),
                administratorId
            ])
            .then(async result => {
                resolve(await this.getById(administratorId, options));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            });
        });
    }

    public async delete(administratorId: number): Promise<IErrorResponse> {
        return await this.deleteByIdFromTable("administrator", administratorId);
    }

    public async getByUsername(username: string, options: Partial<AdministratorModelAdapterOptions> = {}): Promise<AdministratorModel | null> {
        const administrators = await this.getAllActiveByFieldNameFromTable("administrator", "username", username, options);

        if (!Array.isArray(administrators) || administrators.length === 0) {
            return null;
        }

        return administrators[0];
    }
}

export default AdministratorService;
