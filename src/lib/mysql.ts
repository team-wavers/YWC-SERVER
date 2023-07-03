import { Sequelize } from "sequelize";
import env from "../env";
import logger from "../lib/logger";
import { Store } from "../models/store.model";
import { validateSchemas } from "./validate-schema";

const sequelize = new Sequelize(
    env.mysql.schema,
    env.mysql.username,
    env.mysql.password,
    {
        host: env.mysql.host,
        dialect: "mysql",
        dialectOptions: {
            connectTimeout: env.mode.prod ? 5000 : 60000, // 5s for prod, 1min for dev
        },
        pool: {
            max: 30,
            min: 0,
            acquire: 60000,
            idle: 5000,
        },
        port: parseInt(env.mysql.port, 10),
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
            freezeTableName: true,
        },
        timezone: "+09:00",
        logQueryParameters: !env.mode.prod,
        logging: (query) => {
            if (query?.includes("SELECT 1+1 AS result")) return;
            logger.sql(query.replace(/(\r\n|\n|\r)/gm, ""));
        },
    }
);

export { sequelize as mysql };

export function initModels() {
    Store.initModel(sequelize);
}
export function connect() {
    return new Promise((resolve, reject) => {
        initModels();

        sequelize
            .authenticate()
            .then(async function onSequelizeAuthSuccess() {
                logger.log(
                    "MySQL connection has been established successfully."
                );

                try {
                    await validateSchemas(sequelize, {
                        logging: env.mode.prod ? logger.debug : console.log,
                    });
                    resolve(sequelize);
                } catch (e) {
                    logger.log(JSON.stringify(e));
                    logger.error(e);
                    reject(e);
                }
            })
            .catch(async function onSequelizeAuthError(err) {
                logger.log(JSON.stringify(err));
                logger.error("Unable to connect to the database:", err);
                reject(err);
            });
    });
}
