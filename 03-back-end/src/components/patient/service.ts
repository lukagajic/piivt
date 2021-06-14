import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import PatientModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddPatient } from './dto/AddPatient';
import { IEditPatient } from './dto/EditPatient';
import * as bcrypt from 'bcrypt';
import DoctorModel from '../doctor/model';

class PatientModelAdapterOptions implements IModelAdapterOptions {
    loadDoctor: boolean = false;
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
        item.doctorId = +(data?.doctor_id);

        if (options.loadDoctor === true) {
            item.doctor = await this.services.doctorService.getById(item.doctorId) as DoctorModel;
        }

        return item;
    }
    
    public async getAll(
        options: Partial<PatientModelAdapterOptions> = { }
    ): Promise<PatientModel[] | IErrorResponse> {
        return await this.getAllFromTable<PatientModelAdapterOptions>("patient", options) as PatientModel[];
    }

    public async getAllGenderValues(): Promise<string[] | IErrorResponse> {
        return new Promise<string[] | IErrorResponse>(async resolve => {
            const sql: string = 
            `
                SELECT SUBSTRING(COLUMN_TYPE,5) as genderValues
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA='aplikacija'     
                    AND TABLE_NAME='patient'
                    AND COLUMN_NAME='gender';
            `;

            this.db.execute(sql)
                .then(async result => {
                    const rows = result[0];

                    let genderValues: string = rows[0]?.genderValues;
                    genderValues = genderValues.replace(/'/g,'').replace("(", "").replace(")", "");
                    const genderValuesArray: string[] = genderValues.split(",");

                    return resolve(genderValuesArray);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async getAllByDoctorId(doctorId: number, options: Partial<PatientModelAdapterOptions> = { }): Promise<PatientModel[] | IErrorResponse> {
        return await this.getAllByFieldNameFromTable("patient", "doctor_id", doctorId, options);
    }

    public async getAllActiveByDoctorId(doctorId: number, options: Partial<PatientModelAdapterOptions> = {}): Promise<PatientModel[] | IErrorResponse> {
        return new Promise<PatientModel[] | IErrorResponse>(async resolve => {
            const sql: string = 
            `
                SELECT
                    patient.*
                FROM
                    patient
                INNER JOIN
                    doctor 
                ON
                    patient.doctor_id = doctor.doctor_id
                WHERE
                    patient.is_active = 1
                AND
                    doctor.doctor_id = ?    
                ;
            `;

            this.db.execute(sql, [doctorId])
                .then(async result => {
                    const rows = result[0];

                    const lista: PatientModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(
                                await this.adaptModel(row, options)
                            );
                        }
                    }        
                    resolve(lista);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async getById(patientId: number, options: Partial<PatientModelAdapterOptions> = { }): Promise<PatientModel | null | IErrorResponse> {
        return await this.getByIdFromTable<PatientModelAdapterOptions>("patient", patientId, options);
    }

    public async add(data: IAddPatient, doctorId: number): Promise<PatientModel | IErrorResponse > {
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
                    doctor_id = ?;
                ON DUPLICATE KEY
                UPDATE
                    patient
                SET
                    is_active = 1;
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
                doctorId
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
                    address = ?
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
