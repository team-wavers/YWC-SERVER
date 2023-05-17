export interface IStore {
    _id?: number;
	number?: string;
	name?: string;
	phone?: string;
	address?: string;
	category?: string;
	latitude?: number;
	longitude?: number;
    deleted_at?: Date;
    updated_at?: Date;
    created_at?: Date;
}
