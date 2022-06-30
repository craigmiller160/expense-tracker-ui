import { DbRecord } from './db';

export interface CategoryResponse extends DbRecord {
	readonly name: string;
}

export interface CategoryRequest {
	readonly name: string;
}

export interface CategoryDetails {
	readonly isNew: boolean;
	readonly id?: string;
	readonly name: string;
}
