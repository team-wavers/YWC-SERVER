import { Store } from "../../../models/store.model";
import StoreRepository from "./store.repository";
import sequelize from "sequelize";
import { assertNotNull } from "../../../lib/utils";
import ApiError from "../../../common/api.error";
import ApiCodes from "../../../common/api.codes";
import ApiMessages from "../../../common/api.messages";

export default class StoreService {
    list = async (page, size): Promise<{ rows; count }> => {
        return new StoreRepository().findAll(page, size);
    };

    search = async (q, page, size, filter): Promise<{ rows; count }> => {
        return new StoreRepository().search(q, page, size, filter);
    };

    nearbyList = async ({
        longitude,
        latitude,
        distance,
    }): Promise<{ rows; count }> => {
        assertNotNull(
            latitude && longitude,
            new ApiError(ApiCodes.BAD_REQUEST, ApiMessages.BAD_REQUEST, {
                message: "latitude and longitude are required",
            })
        );

        const stores = await Store.findAndCountAll({
            where: sequelize.where(
                sequelize.literal(
                    `(6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) * 1000`
                ),
                "<=",
                distance
            ),
            order: sequelize.literal(
                `(6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) * 1000`
            ),
        });

        return stores;
    };
}
