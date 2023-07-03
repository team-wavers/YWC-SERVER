import logger from "./logger";
import { mysql } from "./mysql";

export async function deleteDuplicateStores() {
    try {
        const dedupe = `
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
            `;
        await mysql.query(dedupe);

        logger.log("Duplicate stores deleted successfully!!");
    } catch (error) {
        logger.debug("Error deleting duplicate stores:", error);
    }
}
