import IConfig from './IConfig.interface';

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
    }
}

export default Config;
