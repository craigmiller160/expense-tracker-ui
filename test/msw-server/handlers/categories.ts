import { v4 as uuidv4 } from 'uuid';
import type {
	CategoryRequest,
	CategoryResponse
} from '../../../src/types/generated/expense-tracker';
import type { DefaultBodyType, PathParams, RequestHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import { database } from '../Database';

const getAllCategoriesHandler: RequestHandler = http.get<
	PathParams,
	DefaultBodyType,
	ReadonlyArray<CategoryResponse>
>('http://localhost/expense-tracker/api/categories', () => {
	const results = Object.values(database.data.categories).sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	return HttpResponse.json(results);
});

const createCategory: RequestHandler = http.post<
	PathParams,
	CategoryRequest,
	CategoryResponse
>('http://localhost/expense-tracker/api/categories', async ({ request }) => {
	const requestBody = await request.json();
	const category: CategoryResponse = {
		id: uuidv4(),
		name: requestBody.name,
		color: '#ffffff'
	};
	database.updateData((draft) => {
		draft.categories[category.id] = category;
	});
	return HttpResponse.json(category);
});

const updateCategory: RequestHandler = http.put<
	{ id: string },
	CategoryRequest,
	CategoryResponse
>(
	'http://localhost/expense-tracker/api/categories/:id',
	async ({ request, params }) => {
		const id = params.id;
		const requestBody = await request.json();
		database.updateData((draft) => {
			const existing = draft.categories[id];
			if (existing) {
				draft.categories[id] = {
					id,
					name: requestBody.name,
					color: '#ffffff'
				};
			}
		});
		return HttpResponse.text('', {
			status: 204
		});
	}
);

const deleteCategory: RequestHandler = http.delete<{ id: string }>(
	'http://localhost/expense-tracker/api/categories/:id',
	({ params }) => {
		const id = params.id;
		database.updateData((draft) => {
			delete draft.categories[id];
		});
		return HttpResponse.text('', {
			status: 204
		});
	}
);

export const categoryHandlers: ReadonlyArray<RequestHandler> = [
	getAllCategoriesHandler,
	createCategory,
	updateCategory,
	deleteCategory
];
