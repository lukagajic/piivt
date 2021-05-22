import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import CategoryRouter from './components/category/router';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import ServiceRouter from './components/service/router';
import CategoryService from './components/category/service';
import ServiceService from './components/service/service';

async function main() {
    const application: express.Application = express();

    application.use(cors());
    application.use(express.json());

    const resources: IApplicationResources = {
        databaseConnection: await mysql2.createConnection({
            host: Config.database.host,
            port: Config.database.port,
            user: Config.database.user,
            password: Config.database.password,
            database: Config.database.database,
            charset: Config.database.charset,
            timezone: Config.database.timezone,
            supportBigNumbers: true
        })
    }    
    
    resources.databaseConnection.connect();

    resources.services = {
        categoryService: new CategoryService(resources),
        serviceService: new ServiceService(resources)
    };

    application.use(Config.server.static.route, express.static(Config.server.static.path, {
        index: Config.server.static.index,
        cacheControl: Config.server.static.cacheControl,
        maxAge: Config.server.static.maxAge,
        etag: Config.server.static.etag,
        dotfiles: Config.server.static.dotFiles
    }));
    
    Router.setupRoutes(application, resources, [
        new CategoryRouter(),
        new ServiceRouter()
    ]);
    
    application.use((req, res) => {
        res.sendStatus(404);
    });

    application.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });
    
    application.listen(Config.server.port, () => {
        console.log(`Server je aktivan na adresi: http://localhost:${Config.server.port}/`);
    });
}

main();
