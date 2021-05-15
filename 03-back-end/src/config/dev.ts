import IConfig from '../common/IConfig.interface';

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
    }
}

export default Config;
