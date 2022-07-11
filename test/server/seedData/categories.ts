import { DataUpdater } from '../Database';
import { CategoryResponse } from '../../../src/types/categories';
import { nanoid } from 'nanoid';

const createCategory = (name: string): CategoryResponse => ({
	id: nanoid(),
	name
});

export const seedCategories: DataUpdater = (draft) => {
	draft.categories = {};
	const category1 = createCategory('Groceries');
	const category2 = createCategory('Restaurants');
	const category3 = createCategory('Entertainment');
	draft.categories[category1.id] = category1;
	draft.categories[category2.id] = category2;
	draft.categories[category3.id] = category3;
};
