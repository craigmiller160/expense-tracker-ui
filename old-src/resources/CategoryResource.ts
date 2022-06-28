import { DefaultResourceReturn } from './types';
import { CategoryResponse } from '../types/categories';
import { createResource } from 'solid-js';
import { getAllCategories } from '../services/CategoryService';

export const getAllCategoriesResource: DefaultResourceReturn<
	ReadonlyArray<CategoryResponse>
> = createResource(getAllCategories);
