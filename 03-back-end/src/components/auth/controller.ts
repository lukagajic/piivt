import BaseController from '../../common/BaseController';
import { Request, Response, NextFunction } from "express";
import { IDoctorLogin, IDoctorLoginValidator } from './dto/IDoctorLogin';
import DoctorModel from '../doctor/model';
import * as bcrypt from 'bcrypt';
import ITokenData from './dto/ITokenData.interface';
import * as jwt from "jsonwebtoken";
import Config from '../../config/dev';
import { IAdministratorLogin, IAdministratorLoginValidator } from './dto/IAdministratorLogin';
import AdministratorModel from '../administrator/model';

export default class AuthController extends BaseController {
    async doctorLogin(req: Request, res: Response, next: NextFunction) {
        if (!IDoctorLoginValidator(req.body)) {
            return res.status(400).send(IDoctorLoginValidator.errors);
        }

        const data: IDoctorLogin = req.body as IDoctorLogin;
        const doctor: DoctorModel | null = await this.services.doctorService.getByEmail(data.email, {
            showPassword: true
        });

        if (doctor === null) {
            return res.sendStatus(404);
        }

        if (!bcrypt.compareSync(data.password, doctor.passwordHash)) {
            // Anti-brute-force mera: sacekati 1s pre slanja odgovora da lozinka nije dobra
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(403).send("Invalid doctor password");
        }

        const authTokenData: ITokenData = {
            id: doctor.doctorId,
            identity: doctor.email,
            role: "doctor"
        };

        const refreshTokenData: ITokenData = {
            id: doctor.doctorId,
            identity: doctor.email,
            role: "doctor"
        };

        const authToken = jwt.sign(
            authTokenData,
            Config.auth.doctor.auth.private,
            {
                algorithm: Config.auth.doctor.algorithm,
                issuer: Config.auth.doctor.issuer,
                expiresIn: Config.auth.doctor.auth.duration
            }
        );

        const refreshToken = jwt.sign(
            refreshTokenData,
            Config.auth.doctor.refresh.private,
            {
                algorithm: Config.auth.doctor.algorithm,
                issuer: Config.auth.doctor.issuer,
                expiresIn: Config.auth.doctor.refresh.duration
            }
        );

        res.send({
            authToken: authToken,
            refreshToken: refreshToken
        });
    }

    async administratorLogin(req: Request, res: Response, next: NextFunction) {
        if (!IAdministratorLoginValidator(req.body)) {
            return res.status(400).send(IAdministratorLoginValidator.errors);
        }

        const data: IAdministratorLogin = req.body as IAdministratorLogin;

        const administrator: AdministratorModel | null = await this.services.administratorService.getByUsername(data.username);

        if (administrator === null) {
            return res.sendStatus(404);
        }

        if (administrator.isActive === false) {
            return res.status(403).send("Administrator is not active!");
        }

        if (!bcrypt.compareSync(data.password, administrator.passwordHash)) {
            // Anti-brute-force mera: sacekati 1s pre slanja odgovora da lozinka nije dobra
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(403).send("Invalid administrator password");
        }

        const authTokenData: ITokenData = {
            id: administrator.administratorId,
            identity: administrator.username,
            role: "administrator"
        };

        const refreshTokenData: ITokenData = {
            id: administrator.administratorId,
            identity: administrator.username,
            role: "administrator"
        };

        const authToken = jwt.sign(
            authTokenData,
            Config.auth.administrator.auth.private,
            {
                algorithm: Config.auth.administrator.algorithm,
                issuer: Config.auth.administrator.issuer,
                expiresIn: Config.auth.administrator.auth.duration
            }
        );

        const refreshToken = jwt.sign(
            refreshTokenData,
            Config.auth.administrator.refresh.private,
            {
                algorithm: Config.auth.administrator.algorithm,
                issuer: Config.auth.administrator.issuer,
                expiresIn: Config.auth.administrator.refresh.duration
            }
        );

        res.send({
            authToken: authToken,
            refreshToken: refreshToken
        });
    }
}