import type { PropsWithChildren } from 'react';
import { PageResponsiveWrapper } from '../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { Spinner } from '../UI/Spinner';
import { useGetAllCategories } from '../../ajaxapi/query/CategoryQueries';

export const PreContentLoading = (props: PropsWithChildren) => {
	const { isFetched } = useGetAllCategories();
	return (
		<>
			{!isFetched && (
				<PageResponsiveWrapper>
					<Spinner />
				</PageResponsiveWrapper>
			)}
			{isFetched && props.children}
		</>
	);
};
