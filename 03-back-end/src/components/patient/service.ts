import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import PatientModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddPatient } from './dto/AddPatient';
import { IEditPatient } from './dto/EditPatient';
import * as bcrypt from 'bcrypt';

class PatientModelAdapterOptions implements IModelAdapterOptions {
    
}

class PatientService extends BaseService<PatientModel> {
    protected async adaptModel(data: any, options: Partial<PatientModelAdapterOptions>): Promise<PatientModel> {
        const item: PatientModel = new PatientModel();

        item.patientId = +(data?.patient_id);
        item.forename = data?.forename;
        item.surname = data?.surname;
        item.bornAt = data?.born_at;
        item.gender = data?.gender;
        item.email = data?.email;
        item.personalIdentityNumber = data?.personal_identity_number;
        item.phoneNumber = data?.phone_number;
        item.address = data?.address;
        item.isActive = +(data?.is_active) === 1;
        item.createdAt = new Date(data?.created_at);

        return item;
    }
    
    public async getAll(
        options: Partial<PatientModelAdapterOptions> = { }
    ): Promise<PatientModel[] | IErrorResponse> {
        return await this.getAllFromTable<PatientModelAdapterOptions>("patient", options) as PatientModel[];
    }

    public async getById(patientId: number, options: Partial<PatientModelAdapterOptions> = { }): Promise<PatientModel | null | IErrorResponse> {
        return await this.getByIdFromTable<PatientModelAdapterOptions>("patient", patientId, options);
    }

    public async add(data: IAddPatient): Promise<PatientModel | IErrorResponse > {
        return new Promise<PatientModel | IErrorResponse>(async resolve => {
            const sql: string = `
                INSERT
                    patient
                SET
                    forename = ?,
                    surname = ?,
                    born_at = ?,
                    gender = ?,
                    email = ?,
                    personal_identity_number = ?,
                    phone_number = ?,
                    address = ?,
                    is_active = ?;
            `;

            this.db.execute(sql, [
                data.forename,
                data.surname,
                data.bornAt,
                data.gender,
                data.email,
                data.personalIdentityNumber,
                data.phoneNumber,
                data.address,
                data.isActive === true ? 1 : 0
             ])
                .then(async result => {
                    const insertInfo: any = result[0];
                    
                    const newPatientId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newPatientId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }

    public async edit(patientId: number, data: IEditPatient, options: Partial<PatientModelAdapterOptions> = { }): Promise<PatientModel | null | IErrorResponse> {
        const result: PatientModel | IErrorResponse = await this.getById(patientId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof PatientModel)) {
            return result;
        }

        return new Promise<PatientModel | IErrorResponse>(async resolve => {
            const sql: string = `
                UPDATE
                    patient
                SET
                    forename = ?,
                    surname = ?,
                    born_at = ?,
                    gender = ?,
                    email = ?,
                    personal_identity_number = ?,
                    phone_number = ?,
                    address = ?,
                    is_active = ?
                WHERE
                    patient_id = ?;
            `;

            this.db.execute(sql, [
                data.forename,
                data.surname,
                data.bornAt,
                data.gender,
                data.email,
                data.personalIdentityNumber,
                data.phoneNumber,
                data.address,
                data.isActive === true ? 1 : 0,
                patientId
             ])
            .then(async result => {
                resolve(await this.getById(patientId, options));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            });
        });
    }

    public async delete(patientId: number): Promise<IErrorResponse> {
        return await this.deleteByIdFromTable("patient", patientId);
    }

}

export default PatientService;
