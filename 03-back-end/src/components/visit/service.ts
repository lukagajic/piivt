import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import VisitModel, { VisitServiceRecord } from './model';
import PatientModel from '../patient/model';
import DoctorModel from '../doctor/model';
import ServiceModel from '../service/model';
import IErrorResponse from '../../common/IErrorResponse.inteface';
import { IAddVisit } from './dto/AddVisit';
import { IEditVisit } from './dto/EditVisit';
import { timeStamp } from 'console';

class VisitModelAdapterOptions implements IModelAdapterOptionsInterface {
    loadPatient: boolean = false;
    loadDoctor: boolean = false;
    loadEditorDoctor: boolean = false;
    loadServices: boolean = false;
}

class VisitService extends BaseService<VisitModel> {
    protected async adaptModel(data: any, options: Partial<VisitModelAdapterOptions>): Promise<VisitModel> {
        const item: VisitModel = new VisitModel();

        item.visitId = +(data?.visit_id);
        item.createdAt = new Date(data?.created_at);
        item.description = data?.description;
        item.patientId = +(data?.patient_id);
        item.doctorId = +(data?.doctor_id);
        item.editorDoctorId = +(data?.editor__doctor_id);

        if (options.loadPatient === true) {
            item.patient = await this.services.patientService.getById(item.patientId) as PatientModel;
        }

        if (options.loadDoctor === true) {
            item.doctor = await this.services.doctorService.getById(item.doctorId) as DoctorModel;
        }

        if (options.loadEditorDoctor === true) {
            item.editorDoctor = await this.services.doctorService.getById(item.editorDoctorId) as DoctorModel;
        }

        if (options.loadServices === true) {
            item.services = await this.getAllServicesByVisitId(item.visitId);
        }
        
        return item;
    }


    private async getAllServicesByVisitId(visitId: number): Promise<VisitServiceRecord[]> {
        const sql = `
            SELECT
                *
            FROM
                visit_service
            WHERE
                visit_service.visit_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ visitId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: VisitServiceRecord[] = [];

        for (const row of rows as any) {
            items.push({
                serviceId: +(row?.service_id),
                description: row?.description,
                service: await this.services.serviceService.getById(row?.service_id) as ServiceModel 
            });
        }

        return items;
    }

    public async getAll(
        options: Partial<VisitModelAdapterOptions> = { }
    ): Promise<VisitModel[] | IErrorResponse> {
        return await this.getAllFromTable<VisitModelAdapterOptions>("visit", options);
    }

    public async getById(visitId: number, options: Partial<VisitModelAdapterOptions> = { }): Promise<VisitModel | null | IErrorResponse> {
        return await this.getByIdFromTable<VisitModelAdapterOptions>("visit", visitId, options);
    }

    public async add(data: IAddVisit): Promise<VisitModel | IErrorResponse > {
        return new Promise<VisitModel | IErrorResponse>(async resolve => {
            this.db.beginTransaction()
                .then(() => {
                    const sql: string = `
                        INSERT
                            visit
                        SET
                            description = ?,
                            patient_id = ?,
                            doctor_id = ?,
                            editor__doctor_id = ?;
                    `
                    this.db.execute(sql, [
                        data.description,
                        data.patientId,
                        data.doctorId,
                        data.doctorId
                    ]).then(async (res: any) => {
                        const newVisitId: number = +(res[0]?.insertId);

                        const promises = [];
                        
                        for (const visitService of data.services) {
                            promises.push(
                                this.db.execute(`
                                    INSERT
                                        visit_service
                                    SET
                                        visit_id = ?,
                                        service_id = ?,
                                        description = ?;
                                `, 
                                [
                                    newVisitId,
                                    visitService.serviceId,
                                    visitService.description
                                ])
                            );
                        }

                        Promise.all(promises)
                            .then(async () => {
                                await this.db.commit();

                                resolve(await this.getById(newVisitId, {
                                    loadDoctor: true,
                                    loadEditorDoctor: true,
                                    loadServices: true
                                }));
                            })
                            .catch(async error => {
                                await this.db.rollback();

                                resolve({
                                    errorCode: error?.errno,
                                    errorMessage: error?.sqlMessage
                                });
                            });

                    })
                    .catch(async error => {
                        await this.db.rollback();

                        resolve({
                            errorCode: error?.errno,
                            errorMessage: error?.sqlMessage
                        });
                    })
                });
        });
    }

    private async editVisit(visitId: number, editorDoctorId: number, data: IEditVisit) {
        const sql: string = `
            UPDATE
                visit
            SET
                description = ?,
                editor__doctor_id = ?
            WHERE
                visit_id = ?;

        `
        return this.db.execute(sql, [
            data.description,
            editorDoctorId,
            visitId
        ]);
    }

    private insertOrUpdateServiceRecord(visitId: number, vsr: VisitServiceRecord) {
        const sql: string = `
            INSERT
                visit_service
            SET
                visit_id = ?,
                service_id = ?,
                description = ?
            ON DUPLICATE KEY
            UPDATE
                description = ?;
        `;
        return this.db.execute(sql, [
            visitId,
            vsr.serviceId,
            vsr.description,
            vsr.description
        ]);
    }

    private deleteVisitServiceRecord(visitId: number, serviceId: number) {
        const sql: string = `
            DELETE FROM
                visit_service
            WHERE
                visit_id = ? AND
                service_id = ?;
        `;

        return this.db.execute(sql, [
            visitId,
            serviceId
        ]);
    }

    public async edit(visitId: number, editorDoctorId: number, data: IEditVisit): Promise<VisitModel | null | IErrorResponse> {        
        return new Promise<VisitModel | null | IErrorResponse>(async resolve => {
            const currentVisit = await this.getById(visitId, {
                loadServices: true
            });

            if (currentVisit === null) {
                return resolve(null);
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            }

            this.db.beginTransaction()
                .then(() => {
                    this.editVisit(visitId, editorDoctorId, data)
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Doslo je do greske u izmeni posete: " + error?.sqlMessage
                        });
                    })
                })
                .then(async () => {
                    const willHaveServiceRecords = data.services.map(vsr => vsr.serviceId);
                    const currentServiceRecords = (currentVisit as VisitModel).services.map(vsr => vsr.serviceId);

                    for (const currentServiceRecord of currentServiceRecords) {
                        if (!willHaveServiceRecords.includes(currentServiceRecord)) {
                            this.deleteVisitServiceRecord(visitId, currentServiceRecord)
                            .catch(error => {
                                rollbackAndResolve({
                                    errno: error?.errno,
                                    sqlMessage: "Došlo je do greške u brisanju starih usluga za ovu posetu: " + error?.sqlMessage
                                });
                            });
                        }
                    }
                })
                .then(async () => {
                    for (const vsr of data.services) {
                        this.insertOrUpdateServiceRecord(visitId, vsr)
                        .catch(error => {
                            rollbackAndResolve({
                                errno: error?.errno,
                                sqlMessage: "Došlo je do greške u dodavanju/izmeni usluga za ovu posetu: " + error?.sqlMessage
                            });
                        })
                    }
                })
                .then(async () => {
                    this.db.commit()
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Došlo je do greške pri čuvanju podataka: " + error?.sqlMessage
                        });
                    })
                })
                .then(async () => {
                    resolve(await this.getById(visitId, {
                        loadDoctor: true,
                        loadEditorDoctor: true,
                        loadServices: true
                    }));
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
        });
    }

    private async deleteVisitServiceRecords(visitId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM
                    visit_service
                WHERE
                    visit_id = ?;
                `,
                [
                    visitId
                ])
                .then(() => resolve(true))
                .catch(() => resolve(false));
        })
    }

    private async deleteVisitRecord(visitId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM visit WHERE visit_id = ?;`,
                [ visitId ]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }

    public async deleteById(visitId: number): Promise<IErrorResponse | null> {
        return new Promise<IErrorResponse>(async resolve => {
            const currentVisit = await this.getById(visitId, {
                loadServices: true
            });

            if (currentVisit === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deleteVisitServiceRecords(visitId)) return;
                    throw { errno: -1002, sqlMessage: "Nije moguće obrisati sve usluge vezane za ovu posetu!" };
                })
                .then(async () => {
                    if (await this.deleteVisitRecord(visitId)) return;
                    throw { errno: -1002, sqlMessage: "Nije moguće obrisati posetu!" };                   
                })
                .then(async () => {
                    await this.db.commit();
                    resolve({
                        errorCode: 0,
                        errorMessage: "Uspеšno obrisana poseta!"
                    });
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }
}

export default VisitService;
