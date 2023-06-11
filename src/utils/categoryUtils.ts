import { CategoryResponse } from '../types/generated/expense-tracker';
import { useMemo } from 'react';
import { CategoryOption } from '../types/categories';
import { match, P } from 'ts-pattern';

export const categoryToCategoryOption = (
	category: CategoryResponse
): CategoryOption => ({
	label: category.name,
	value: category.id
});

export const useCategoriesToCategoryOptions = (
	categories: ReadonlyArray<CategoryResponse> | undefined,
	unknownCategory?: CategoryResponse
): ReadonlyArray<CategoryOption> =>
	useMemo(
		() =>
			[...(categories ?? []), unknownCategory]
				.filter((cat) => !!cat)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				.map((cat) => categoryToCategoryOption(cat!))
				.sort((cat1, cat2) => cat1.label.localeCompare(cat2.label)),
		[categories, unknownCategory]
	);

type Item = {
	readonly categoryId?: string;
	readonly categoryName?: string;
};

export const itemWithCategoryToCategoryOption = (
	item: Item
): CategoryOption | null =>
	match(item)
		.with(
			{ categoryId: P.not(P.nullish) },
			(t): CategoryOption => ({
				value: t.categoryId!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
				label: t.categoryName! // eslint-disable-line @typescript-eslint/no-non-null-assertion
			})
		)
		.otherwise(() => null);
