import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import {
	CategoryRequest,
	CategoryResponse
} from '../../../src/types/generated/expense-tracker';
import { nanoid } from 'nanoid';

export const createCategoriesRoutes = (database: Database, server: Server) => {
	server.get('/categories', () => {
		return Object.values(database.data.categories).sort((a, b) =>
			a.name.localeCompare(b.name)
		);
	});

	server.post('/categories', (schema, request) => {
		const requestBody = JSON.parse(request.requestBody) as CategoryRequest;
		const category: CategoryResponse = {
			id: nanoid(),
			name: requestBody.name,
			color: '#ffffff'
		};
		database.updateData((draft) => {
			draft.categories[category.id] = category;
		});
		return category;
	});

	server.put('/categories/:id', (schema, request) => {
		const id = request.params.id as string;
		const requestBody = JSON.parse(request.requestBody) as CategoryRequest;
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
		return new Response(204);
	});

	server.delete('/categories/:id', (schema, request) => {
		const id = request.params.id as string;
		database.updateData((draft) => {
			delete draft.categories[id];
		});
		return new Response(204);
	});
};
