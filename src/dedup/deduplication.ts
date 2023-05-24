import { QueryTypes, Sequelize } from "sequelize";
import { mysql } from "../lib/mysql";

export function deleteDuplicateStores() {
    try {
        mysql.query(
            `
            DELETE t1
            FROM stores t1
            JOIN (
                SELECT name, longitude, latitude
                FROM stores
                GROUP BY name, longitude, latitude
                HAVING COUNT(*) > 1
            ) t2 ON t1.name = t2.name
                AND t1.longitude = t2.longitude
                AND t1.latitude = t2.latitude
        `,
            {
                type: QueryTypes.DELETE,
            }
        );

        console.log("Duplicate stores deleted successfully!!");
    } catch (error) {
        console.error("Error deleting duplicate stores:", error);
    }
}
