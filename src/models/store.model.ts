import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import { IStore } from "../@types/store";

export class Store extends Model<IStore> implements IStore {
    declare _id: number;
    declare name?: string;
    declare number?: string;
    declare category?: string;
    declare address?: string;
    declare bank?: string;
    declare latitude?: number;
    declare longitude?: number;
    declare deleted_at?: Date;
    declare updated_at?: Date;
    declare created_at: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof Store {
        Store.init(
            {
                _id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                number: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                category: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                address: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                bank: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                latitude: {
                    type: DataTypes.DECIMAL(12, 8),
                    allowNull: true,
                },
                longitude: {
                    type: DataTypes.DECIMAL(12, 8),
                    allowNull: true,
                },
                deleted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "stores",
                modelName: "store",
                freezeTableName: true,
                timestamps: false,
                paranoid: false,
                indexes: [
                    {
                        name: "PRIMARY",
                        unique: true,
                        using: "BTREE",
                        fields: ["_id"],
                    },
                ],
            }
        );

        return Store;
    }
}
