import {SyncFromParams, SyncToParams} from '../../../routes/useSearchParamSync';
import {TransactionSearchForm, transactionSearchFormDefaultValues} from './utils';
import {isSortDirection, SortDirection} from '../../../types/misc';
import {parseServerDate} from '../../../utils/dateTimeUtils';
import {CategoryOption} from '../../../types/categories';
import {UseFormReturn} from 'react-hook-form';
import {useGetAllCategories} from '../../../ajaxapi/query/CategoryQueries';
import {useCategoriesToCategoryOptions} from '../../../utils/categoryUtils';
import {useFormWithSearchParamSync} from '../../../routes/useFormWithSearchParamSync';

const formToParams: SyncToParams<TransactionSearchForm> = (form) => {
    const params = new URLSearchParams();
    // TODO finish this
    return params;
};

const parseSortDirection = (value: string | null): SortDirection =>
    isSortDirection(value)
        ? value
        : transactionSearchFormDefaultValues.direction;
const parseDate = (value: string | null, defaultValue: Date): Date => {
    if (!value) {
        return defaultValue;
    }

    return parseServerDate(value);
};

const formFromParams =
    (
        categories: ReadonlyArray<CategoryOption>
    ): SyncFromParams<TransactionSearchForm> =>
        (params) => {
            // TODO finish this
            const direction = parseSortDirection(params.get('direction'));
            const startDate = parseDate(params.get('startDate'), transactionSearchFormDefaultValues.startDate);,

            return {
                direction,
                startDate
            };
        };

export const useSetupFilterForm = (): UseFormReturn<TransactionSearchForm> => {
    const { data } = useGetAllCategories();
    const categories = useCategoriesToCategoryOptions(data);
    return useFormWithSearchParamSync<TransactionSearchForm>({
        formToParams,
        formFromParams: formFromParams(categories),
        formFromParamsDependencies: [categories],
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: transactionSearchFormDefaultValues
    });
};