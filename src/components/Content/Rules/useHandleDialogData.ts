import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { CategoryOption } from '../../../types/categories';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { categoryToCategoryOption } from '../../../utils/categoryUtils';
import {useGetRule} from '../../../ajaxapi/query/AutoCategorizeRuleQueries';

type Props = {
	readonly selectedRuleId: OptionT<string>;
};

type Data = {
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly isFetching: boolean;
};

export const useHandleDialogData = (props: Props): Data => {
	const { data: allCategoriesData, isFetching: allCategoriesIsFetching } =
		useGetAllCategories();

	return {
		categories: allCategoriesData?.map(categoryToCategoryOption) ?? [],
		isFetching: allCategoriesIsFetching
	};
};
