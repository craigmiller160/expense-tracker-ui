import { PropsWithChildren } from 'react';
import { PageResponsiveWrapper } from '../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { Spinner } from '../UI/Spinner';
import { useGetAllCategories } from '../../ajaxapi/query/CategoryQueries';

export const PreContentLoading = (props: PropsWithChildren) => {
	const { isFetching } = useGetAllCategories();
	return (
		<PageResponsiveWrapper>
			{isFetching && <Spinner />}
			{!isFetching && props.children}
		</PageResponsiveWrapper>
	);
};
