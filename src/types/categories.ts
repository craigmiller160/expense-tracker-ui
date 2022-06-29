export interface CategoryResponse {
	readonly id: string;
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
