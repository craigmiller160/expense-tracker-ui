import { useImmer } from 'use-immer';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

type OnConfirmAction = () => void;
export type NewConfirmDialog = (
	title: string,
	message: string,
	onConfirmAction: OnConfirmAction
) => void;

interface State {
	readonly open: boolean;
	readonly title: string;
	readonly message: string;
	readonly onConfirmAction: OnConfirmAction;
}

interface ConfirmDialogContextValue {
	readonly open: boolean;
	readonly title: string;
	readonly message: string;
	readonly onConfirmAction: OnConfirmAction;
	readonly onClose: () => void;
	readonly newConfirmDialog: NewConfirmDialog;
}

export const ConfirmDialogContext = createContext<ConfirmDialogContextValue>({
	open: false,
	title: '',
	message: '',
	onConfirmAction: () => {},
	onClose: () => {},
	newConfirmDialog: () => {}
});

export const useNewConfirmDialog = (): NewConfirmDialog =>
	useContext(ConfirmDialogContext).newConfirmDialog;

export const ConfirmDialogProvider = (props: PropsWithChildren) => {
	const [state, setState] = useImmer<State>({
		open: false,
		title: '',
		message: '',
		onConfirmAction: () => {}
	});

	const contextValue: ConfirmDialogContextValue = {
		...state,
		onClose: () =>
			setState((draft) => {
				draft.open = false;
			}),
		newConfirmDialog: (title, message, onConfirmAction) =>
			setState((draft) => {
				draft.open = true;
				draft.title = title;
				draft.message = message;
				draft.onConfirmAction = onConfirmAction;
			})
	};

	return (
		<ConfirmDialogContext.Provider value={contextValue}>
			{props.children}
		</ConfirmDialogContext.Provider>
	);
};
