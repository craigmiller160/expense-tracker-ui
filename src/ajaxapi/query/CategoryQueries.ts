import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAllCategories, updateCategory } from '../service/CategoryService';
import { CategoryResponse } from '../../types/categories';

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

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, UpdateCategoryParams>(
		({ id, name }) => updateCategory(id, name),
		{
			onSuccess: () => queryClient.invalidateQueries(GET_ALL_CATEGORIES)
		}
	);
};
