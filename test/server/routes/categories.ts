import { Database } from '../Database';
import { Response, Server } from 'miragejs';
import { v4 as uuidv4 } from 'uuid';
import type {
	CategoryRequest,
	CategoryResponse
} from '../../../src/types/generated/expense-tracker';

export const createCategoriesRoutes = (database: Database, server: Server) => {
	server.get('/categories', () => {
		return Object.values(database.data.categories).sort((a, b) =>
			a.name.localeCompare(b.name)
		);
	});

	server.post('/categories', (schema, request) => {
		const requestBody = JSON.parse(request.requestBody) as CategoryRequest;
		const category: CategoryResponse = {
			id: uuidv4(),
			name: requestBody.name,
			color: '#ffffff'
		};
		database.updateData((draft) => {
			draft.categories[category.id] = category;
		});
		return category;
	});

	server.put('/categories/:id', (schema, request) => {
		const id = request.params.id;
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
		const id = request.params.id;
		database.updateData((draft) => {
			delete draft.categories[id];
		});
		return new Response(204);
	});
};
