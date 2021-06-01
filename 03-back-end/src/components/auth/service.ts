import BaseService from '../../common/BaseService';
import IModelAdapterOptionsInterface from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.inteface';

export default class AuthService extends BaseService<{}> {
    protected adaptModel(data: any, options: Partial<IModelAdapterOptionsInterface>): Promise<{}> {
        return null;
    }

    public async insertLoginRecordAttempt(
        email: string,
        ipAddress: string,
        userAgent: string,
        isSuccessful: boolean,
        message: string 
    ): Promise<boolean>  {
        return new Promise<boolean>(async resolve => {
            const sql: string = `
                INSERT
                    login_record
                SET
                    email = ?,
                    ip_address = ?,
                    user_agent = ?,
                    is_successful = ?,
                    message = ?;
            `
            this.db.execute(sql, [
                email, ipAddress, userAgent, isSuccessful === true ? 1 : 0, message
            ])
            .then(res => {
                const insertInfo: any = res[0];
                const newLoginRecordId: number = +(insertInfo?.insertId);

                if (newLoginRecordId > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                resolve(false);
            });
        });
    }
}