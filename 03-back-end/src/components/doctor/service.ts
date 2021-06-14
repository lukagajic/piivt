import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../common/BaseService';
import DoctorModel from './model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddDoctor } from './dto/AddDoctor';

import * as bcrypt from "bcrypt"; 
import { IEditDoctor } from './dto/EditDoctor';
import PatientModel from '../patient/model';


class DoctorModelAdapterOptions implements IModelAdapterOptions {
    showPassword: boolean = false;
    loadPatients: boolean = false;
}

class DoctorService extends BaseService<DoctorModel> {
    protected async adaptModel(data: any, options: Partial<DoctorModelAdapterOptions>): Promise<DoctorModel> {
        const item: DoctorModel = new DoctorModel();

        item.doctorId = +(data?.doctor_id);
        item.forename = data?.forename;
        item.surname = data?.surname;
        item.email = data?.email;
        item.username = data?.username;

        if (options.showPassword === true) {
            item.passwordHash = data?.password_hash
        } else {
            item.passwordHash = undefined
        }

        item.bornAt = data?.born_at;
        item.gender = data?.gender;
        item.title = data?.title;
        item.phoneNumber = data?.phone_number;
        item.isActive = +(data?.is_active) === 1;

        if (options.loadPatients === true) {
            item.patients = await this.services.patientService.getAllActiveByDoctorId(item.doctorId) as PatientModel[];
        }

        return item;
    }


    public async getAll(
        options: Partial<DoctorModelAdapterOptions> = { }
    ): Promise<DoctorModel[] | IErrorResponse> {
        return await this.getAllFromTable<DoctorModelAdapterOptions>("doctor", options) as DoctorModel[];
    }

    public async getById(doctorId: number, options: Partial<DoctorModelAdapterOptions> = { }): Promise<DoctorModel | null | IErrorResponse> {
        return await this.getByIdFromTable<DoctorModelAdapterOptions>("doctor", doctorId, options);
    }

    public async getByEmail(email: string, options: Partial<DoctorModelAdapterOptions> = { }): Promise<DoctorModel | null> {
        const doctors: DoctorModel[] | IErrorResponse = await this.getAllByFieldNameFromTable<DoctorModelAdapterOptions>("doctor", "email", email, options);
        
        if (!Array.isArray(doctors) || doctors.length === 0) {
            return null;
        }

        return doctors[0];
    }

    public async add(data: IAddDoctor): Promise<DoctorModel | IErrorResponse > {
        return new Promise<DoctorModel | IErrorResponse>(async resolve => {
            const sql: string = `
                INSERT
                    doctor
                SET
                    forename = ?,
                    surname = ?,
                    email = ?,
                    username = ?,
                    password_hash = ?,
                    born_at = ?,
                    gender = ?,
                    title = ?,
                    phone_number = ?
                ON DUPLICATE KEY
                UPDATE
                    doctor
                SET
                    is_active = 1'
            `;

            this.db.execute(sql, [
                data.forename,
                data.surname,
                data.email,
                data.username,
                bcrypt.hashSync(data.password, 11),
                data.bornAt,
                data.gender,
                data.title,
                data.phoneNumber
             ])
                .then(async result => {
                    const insertInfo: any = result[0];
                    
                    const newDoctorId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newDoctorId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }

    public async edit(doctorId: number, data: IEditDoctor, options: Partial<DoctorModelAdapterOptions> = { }): Promise<DoctorModel | null | IErrorResponse> {
        const result: DoctorModel | IErrorResponse = await this.getById(doctorId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof DoctorModel)) {
            return result;
        }

        return new Promise<DoctorModel | IErrorResponse>(async resolve => {
            const sql: string = `
                UPDATE
                    doctor
                SET
                    forename = ?,
                    surname = ?,
                    email = ?,
                    username = ?,
                    password_hash = ?,
                    born_at = ?,
                    gender = ?,
                    title = ?,
                    phone_number = ?
                WHERE
                    doctor_id = ?;
            `;
            
            this.db.execute(sql, [ 
                data.forename,
                data.surname,
                data.email,
                data.username,
                bcrypt.hashSync(data.password, 11),
                data.bornAt,
                data.gender,
                data.title,
                data.phoneNumber,
                doctorId
            ])
            .then(async result => {
                resolve(await this.getById(doctorId, options));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            });
        });
    }

    public async delete(doctorId: number): Promise<IErrorResponse> {
        return await this.deleteByIdFromTable("doctor", doctorId);
    }
}

export default DoctorService;
