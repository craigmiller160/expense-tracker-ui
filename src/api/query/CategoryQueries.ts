import { useQuery } from 'react-query';
import { getAllCategories } from '../service/CategoryService';

export const GET_ALL_CATEGORIES = 'CategoryQueries_GetAllCategories';

export const useGetAllCategories = () =>
	useQuery(GET_ALL_CATEGORIES, getAllCategories);
