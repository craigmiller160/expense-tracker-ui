import rawAllCategories from '../../../fixtures/allCategories.json';
import { CategoryResponse } from '../../../../src/types/generated/expense-tracker';

export const allCategories: ReadonlyArray<CategoryResponse> = rawAllCategories;
export const orderedCategoryNames = allCategories.map((cat) => cat.name);
export const orderedCategoryIds = allCategories.map((cat) => cat.id);
