import IConfig from '../common/IConfig.interface';
import { readFileSync } from "fs";

const Config: IConfig = {
    server: {
        port: 9001,
        static: {
            route: "/static",
            path: "./static",
            cacheControl: false,
            dotFiles: "deny",
            etag: false,
            index: false,
            maxAge: 3600000
        }
    },
    database: {
        host: "localhost",
        port: 3307,
        user: "root",
        password: "root",
        database: "aplikacija",
        charset: "utf8",
        timezone: "+01:00"
    },
    auth: {
        doctor: {
            algorithm: "RS256",
            issuer: "localhost",
            auth: {
                duration: 60 * 2, // 60 * 60 * 24 * 7, // Samo dok radimo razvoj
                public: readFileSync("keystore/user-auth.public", "utf-8"),
                private: readFileSync("keystore/user-auth.private", "utf-8")
            },
            refresh: {
                duration: 60 * 60 * 24 * 365, // Samo dok radimo razvoj
                public: readFileSync("keystore/user-refresh.public", "utf-8"),
                private: readFileSync("keystore/user-refresh.private", "utf-8")
            }
        },
        administrator: {
            algorithm: "RS256",
            issuer: "localhost",
            auth: {
                duration: 60 * 60 * 24 * 7, // Samo dok radimo razvoj
                public: readFileSync("keystore/administrator-auth.public", "utf-8"),
                private: readFileSync("keystore/administrator-auth.private", "utf-8")
            },
            refresh: {
                duration: 60 * 60 * 24 * 365, // Samo dok radimo razvoj
                public: readFileSync("keystore/administrator-refresh.public", "utf-8"),
                private: readFileSync("keystore/administrator-refresh.private", "utf-8")
            }
        },
        allowRequestsEvenWithoutValidTokens: false
    }
}

export default Config;
