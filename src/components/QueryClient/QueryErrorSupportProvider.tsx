import { createContext, PropsWithChildren } from 'react';
import { useImmer } from 'use-immer';

interface State {
	readonly hasUnauthorizedError: boolean;
}

type SetHasUnauthorizedError = (value: boolean) => void;

export interface QueryErrorSupportValue {
	readonly hasUnauthorizedError: boolean;
	readonly setHasUnauthorizedError: SetHasUnauthorizedError;
}

export const QueryErrorSupportContext = createContext<QueryErrorSupportValue>({
	hasUnauthorizedError: false,
	setHasUnauthorizedError: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const QueryErrorSupportProvider = (props: PropsWithChildren) => {
	const [state, setState] = useImmer<State>({
		hasUnauthorizedError: false
	});

	const setHasUnauthorizedError: SetHasUnauthorizedError = (value) =>
		setState((draft) => {
			draft.hasUnauthorizedError = value;
		});

	const contextValue: QueryErrorSupportValue = {
		hasUnauthorizedError: state.hasUnauthorizedError,
		setHasUnauthorizedError
	};

	return (
		<QueryErrorSupportContext.Provider value={contextValue}>
			{props.children}
		</QueryErrorSupportContext.Provider>
	);
};
