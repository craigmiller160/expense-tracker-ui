import { PropsWithChildren, useContext, useEffect } from 'react';
import { QueryErrorSupportContext } from './QueryErrorSupportProvider';

// TODO delete this

export const QueryErrorSupportHandler = (props: PropsWithChildren) => {
	const { hasUnauthorizedError, setHasUnauthorizedError } = useContext(
		QueryErrorSupportContext
	);
	useEffect(() => {
		if (hasUnauthorizedError) {
			setHasUnauthorizedError(false);
		}
	}, [hasUnauthorizedError, setHasUnauthorizedError]);

	return <>{props.children}</>;
};
