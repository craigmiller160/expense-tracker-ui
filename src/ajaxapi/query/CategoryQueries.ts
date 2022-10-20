import {
	UseMutateFunction,
	useMutation,
	useQuery,
	useQueryClient
} from 'react-query';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	updateCategory
} from '../service/CategoryService';
import { CategoryResponse } from '../../types/generated/expense-tracker';

export const GET_ALL_CATEGORIES = 'CategoryQueries_GetAllCategories';

export const useGetAllCategories = () =>
	useQuery<ReadonlyArray<CategoryResponse>, Error>(
		GET_ALL_CATEGORIES,
		getAllCategories
	);

interface UpdateCategoryParams {
	readonly id: string;
	readonly name: string;
}

export type UpdateCategoryMutation = UseMutateFunction<
	unknown,
	Error,
	UpdateCategoryParams
>;

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, UpdateCategoryParams>(
		({ id, name }) => updateCategory(id, name),
		{
			onSuccess: () => queryClient.invalidateQueries(GET_ALL_CATEGORIES)
		}
	);
};

interface CreateCategoryParams {
	readonly name: string;
}

export type CreateCategoryMutation = UseMutateFunction<
	CategoryResponse,
	Error,
	CreateCategoryParams
>;

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<CategoryResponse, Error, CreateCategoryParams>(
		({ name }) => createCategory(name),
		{
			onSuccess: () => queryClient.invalidateQueries(GET_ALL_CATEGORIES)
		}
	);
};

interface DeleteCategoryParams {
	readonly id: string;
}

export type DeleteCategoryMutation = UseMutateFunction<
	unknown,
	Error,
	DeleteCategoryParams
>;

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, DeleteCategoryParams>(
		({ id }) => deleteCategory(id),
		{
			onSuccess: () => queryClient.invalidateQueries(GET_ALL_CATEGORIES)
		}
	);
};
