import { PropsWithChildren, useContext, useEffect } from 'react';
import { QueryErrorSupportContext } from './QueryErrorSupportProvider';
import { useGetAuthUser } from '../../ajaxapi/query/AuthQueries';

export const QueryErrorSupportHandler = (props: PropsWithChildren) => {
	const queryErrorSupport = useContext(QueryErrorSupportContext);
	const {
		result: { refetch }
	} = useGetAuthUser();
	useEffect(() => {
		if (queryErrorSupport.hasUnauthorizedError) {
			refetch();
			queryErrorSupport.setHasUnauthorizedError(false);
		}
	}, [queryErrorSupport.hasUnauthorizedError]);

	return <>{props.children}</>;
};
