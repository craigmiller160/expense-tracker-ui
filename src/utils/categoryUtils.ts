import { CategoryResponse } from '../types/generated/expense-tracker';
import { useMemo } from 'react';
import { CategoryOption } from '../types/categories';

export const categoryToCategoryOption = (
	category: CategoryResponse
): CategoryOption => ({
	label: category.name,
	value: category.id
});

export const useCategoriesToCategoryOptions = (
	categories: ReadonlyArray<CategoryResponse> | undefined
): ReadonlyArray<CategoryOption> =>
	useMemo(
		() => categories?.map(categoryToCategoryOption) ?? [],
		[categories]
	);
