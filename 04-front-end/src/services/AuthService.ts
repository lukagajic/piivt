import api from '../api/api';
import { saveAuthToken, saveRefreshToken } from '../api/api';
import EventRegister from '../api/EventRegister';

export default class AuthService {
    public static attemptDoctorLogin(email: string, password: string) {
        api("post", "/auth/doctor/login", "doctor", {
            email: email,
            password: password
        }, false)
        .then(res => {
            if (res.status === "ok") {
                const authToken = res.data?.authToken ?? "";
                const refreshToken = res.data?.refreshToken ?? "";

                saveAuthToken("doctor", authToken);
                saveRefreshToken("doctor", refreshToken);

                EventRegister.emit("AUTH_EVENT", "doctor_login");
            } else {
                EventRegister.emit("AUTH_EVENT", "doctor_login_failed", res.data);
            }
        })
        .catch(err => {
            EventRegister.emit("AUTH_EVENT", "doctor_login_failed", err);
        });
    }
}
