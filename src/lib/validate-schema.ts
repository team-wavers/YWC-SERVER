/**
 * originated from https://github.com/hiradimir/sequelize-validate-schema
 */

import * as Sequelize from 'sequelize';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import assertCore from 'assert';
import assert from 'assert-fine';

interface IModelAttribute {
    type: any;
    primaryKey: boolean;
    autoIncrement: boolean;
    field: string;
    allowNull: boolean;
    unique: boolean;
    name: string;
    onDelete: string;
    onUpdate: string;
    references?: { model: string, key: string };
}

interface IRawModel {
    attributes: { [index: string]: IModelAttribute };
    primaryKeys: { [index: string]: IModelAttribute };
    options: any;
}

// @ts-ignore
interface IDescribedAttribute {
    type: string;
    allowNull: boolean;
    defaultValue: any;
    primaryKey: boolean;
}

const dataTypeToDBTypeDialect: {
    [index: string]: (attr: IModelAttribute) => string
} = {
    // FIXME: necessary to support any dialect
    postgres: (attr: IModelAttribute) => {
        // this support only postgres
        if (attr.type instanceof Sequelize.STRING) {
            // @ts-ignore
            return `CHARACTER VARYING(${attr.type._length})`;
        } else if (attr.type instanceof Sequelize.BIGINT) {
            return 'BIGINT';
        } else if (attr.type instanceof Sequelize.INTEGER) {
            return 'INTEGER';
        } else if (attr.type instanceof Sequelize.DATE) {
            return 'TIMESTAMP WITH TIME ZONE';
        } else if (attr.type instanceof <any>Sequelize.DATEONLY) {
            return 'DATE';
        } else {
            console.error(`${attr.field} is not support schema type.\n${JSON.stringify(attr)}`);
        }
        return undefined;
    },
    mysql: (attr: IModelAttribute) => {
        if (attr.type instanceof Sequelize.STRING) {
            // @ts-ignore
            return `VARCHAR(${attr.type._length})`;
        } else if (attr.type instanceof Sequelize.BIGINT) {
            return 'BIGINT';
        } else if (attr.type instanceof Sequelize.TINYINT) {
            return 'TINYINT(1)';
        } else if (attr.type instanceof Sequelize.INTEGER) {
            return 'INT';
        } else if (attr.type instanceof Sequelize.DATE) {
            return 'DATETIME';
        } else if (attr.type instanceof <any>Sequelize.DATEONLY) {
            return 'DATE';
        } else if (attr.type instanceof Sequelize.JSON) {
            return 'JSON';
        } else if (attr.type instanceof Sequelize.BOOLEAN) {
            return 'BOOLEAN';
        } else if (attr.type instanceof Sequelize.DECIMAL) {
            // @ts-ignore
            return `DECIMAL(${attr.type._precision},${attr.type._scale})`;
        } else if (attr.type instanceof Sequelize.UUID) {
            // https://www.rfc-editor.org/rfc/rfc4122
            // 36 characters
            return 'VARCHAR(40)';
        } else {
            console.error(`${attr.field} is not support schema type.\n${JSON.stringify(attr)}`);
        }
        return undefined;
    },
};

assert.use(assertCore);
assert.beforeThrow(() => {  //  This call is optional.
    return false;              //  The breakpoint place.
});

/**
 * Validate schema of models.
 *
 * @param {Object} [options={}]
 * @param {String[]|function} [options.exclude=[`sequelizeMeta`]] if you want to skip validate table.
 * @param {Boolean|function} [options.logging=console.log] A function that logs sql queries, or false for no logging
 * @return {Promise}
 */
export const validateSchemas = (sequelize, options?) => {

    options = _.clone(options) || {};
    options = _.defaults(options, { exclude: ['SequelizeMeta', 'tags'] }, sequelize.options);

    const queryInterface = sequelize.getQueryInterface();

    // @ts-ignore
    const dataTypeToDBType = dataTypeToDBTypeDialect[sequelize.options.dialect];

    const checkAttributes = async (queryInterface, tableName, model, options) => {
        return queryInterface.describeTable(tableName, options)
            .then(attributes => {
                return Bluebird.each(Object.keys(attributes), fieldName => {
                    const attribute = attributes[fieldName];
                    const modelAttr = model.tableAttributes[fieldName];
                    assert(!_.isUndefined(modelAttr), `${tableName}.${fieldName} is not defined.\n${modelAttr}.\n${JSON.stringify(model.attributes, null, 2)}`);
                    const dataType = dataTypeToDBType(modelAttr);
                    if (dataType !== attribute.type) {
                        console.log('error');
                        dataTypeToDBType(modelAttr);
                    }

                    assert(dataType === attribute.type, `${tableName}.${fieldName} field type is invalid.  Model.${fieldName}.type[${dataType}] != Table.${fieldName}.type[${attribute.type}]`);
                    assert(modelAttr.field === fieldName, `fieldName is not same. Model.field[${modelAttr.field}] != Table.primaryKey[${attribute.primaryKey}]`);
                    assert(modelAttr.primaryKey === true === attribute.primaryKey === true, `illegal primaryKey defined ${tableName}.${fieldName}. Model.primaryKey[${modelAttr.primaryKey}] != Table.primaryKey[${fieldName}]`);


                    assert((modelAttr.allowNull === true || _.isUndefined(modelAttr.allowNull)) === attribute.allowNull === true, `illegal allowNull defined ${tableName}.${fieldName}. Model.allowNull[${modelAttr.allowNull}] != Table.allowNull[${attribute.allowNull}]`);
                });
            });
    };

    const checkForeignKey = (queryInterface, tableName, model, options) => {
        return sequelize.query(queryInterface.queryGenerator.getForeignKeysQuery(tableName), options)
            .then((foreignKeys: Array<any>) => {
                return Bluebird.each(foreignKeys, (fk: any) => {
                    if (sequelize.options.dialect === 'mysql') {
                        // sequelize does not support to get foreignkey info at mysql
                        return;
                    }
                    const modelAttr: IModelAttribute = model.attributes[fk.from.split('\"').join('')];
                    assert(!_.isUndefined(modelAttr.references), `${tableName}.[${modelAttr.field}] must be defined foreign key.\n${JSON.stringify(fk, null, 2)}`);
                    assert(fk.to === modelAttr.references.key, `${tableName}.${modelAttr.field} => ${modelAttr.references.key} must be same to foreignKey [${fk.to}].\n${JSON.stringify(fk, null, 2)}`);
                });
            });
    };

    const checkIndexes = (queryInterface, tableName, model: IRawModel, options) => {
        return queryInterface
            .showIndex(tableName, options)
            .then((indexes: Array<any>) => {
                return Bluebird.each(indexes, index => {
                    if (index.primary) {
                        index.fields.forEach(field => {
                            assert(!_.isUndefined(model.primaryKeys[field.attribute]), `${tableName}.${field.attribute} must be primaryKey`);
                        });
                    } else {
                        const indexFields = _.map(index.fields, (field: any) => {
                            return field.attribute;
                        });

                        const modelIndex = model.options?.indexes?.find((mi: any) => {
                            const modelIndexFields = mi.fields?.map((field: any) => {
                                return typeof field === 'string' ? field : field.name;
                            });
                            return _.isEqual(modelIndexFields.sort(), indexFields.sort());
                        });

                        if (indexFields.length > 1) {
                            assert(!_.isUndefined(modelIndex), `${tableName}.[${indexFields}] must be defined combination key\n${JSON.stringify(index, null, 2)}`);
                        }

                        // @ts-ignore
                        const attributes = model.rawAttributes;
                        if (modelIndex) {
                            assert(modelIndex.unique === true === index.unique === true, `${tableName}.[${indexFields}] must be same unique value\n${JSON.stringify(index, null, 2)}`);
                        } else if (attributes[indexFields[0]] && attributes[indexFields[0]].unique) {
                            assert(index.unique === true, `${tableName}.[${indexFields}] must be defined unique key\n${JSON.stringify(index, null, 2)}`);
                        } else if (attributes[indexFields[0]] && attributes[indexFields[0]].references) {
                            // mysql create index with foreignKey
                            assert(sequelize.options.dialect === 'mysql', `${tableName}.[${indexFields}] is auto created index by mysql.\n${JSON.stringify(index, null, 2)}`);
                        } else {
                            assert(false, `${tableName}.[${indexFields}] is not defined index.${JSON.stringify(index, null, 2)}`);
                        }
                    }
                });
            });
    };

    return Bluebird.try(() => {
        return queryInterface
            .showAllTables(options)
            .then(tableNames => {
                return Bluebird
                    .all(
                        tableNames
                            .sort()
                            .filter(tableName => {
                                // TODO: treat exclude as a function
                                return !_.includes(options.exclude, tableName);
                            })
                            .map(tableName => {
                                const model = sequelize.modelManager.models.find(m => m.tableName === tableName);
                                if (!model) {
                                    console.log(`model ${tableName} is not defined`);
                                }
                                return model;
                            })
                            .map(model => {
                                return checkAttributes(queryInterface, model.tableName, model, options)
                                    .then(() => {
                                        return checkForeignKey(queryInterface, model.tableName, model, options);
                                    })
                                    .then(() => {
                                        return checkIndexes(queryInterface, model.tableName, model, options);
                                    });
                            }),
                    );
            });

    });
};
