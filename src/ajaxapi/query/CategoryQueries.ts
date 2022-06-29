import { useQuery } from 'react-query';
import { getAllCategories } from '../service/CategoryService';
import { CategoryResponse } from '../../types/categories';

export const GET_ALL_CATEGORIES = 'CategoryQueries_GetAllCategories';

export const useGetAllCategories = () =>
	useQuery<ReadonlyArray<CategoryResponse>, Error>(
		GET_ALL_CATEGORIES,
		getAllCategories, {
			retry: false // TODO delete this
		}
	);
