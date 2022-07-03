import { PropsWithChildren, useContext, useEffect } from 'react';
import { QueryErrorSupportContext } from './QueryErrorSupportProvider';
import { useGetAuthUser } from '../../ajaxapi/query/AuthQueries';

export const QueryErrorSupportHandler = (props: PropsWithChildren) => {
	const { hasUnauthorizedError, setHasUnauthorizedError } = useContext(
		QueryErrorSupportContext
	);
	const {
		result: { refetch }
	} = useGetAuthUser();
	useEffect(() => {
		if (hasUnauthorizedError) {
			refetch();
			setHasUnauthorizedError(false);
		}
	}, [hasUnauthorizedError, setHasUnauthorizedError, refetch]);

	return <>{props.children}</>;
};
