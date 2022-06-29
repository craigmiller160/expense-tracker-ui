import { createContext, PropsWithChildren } from 'react';
import { AlertColor } from '@mui/material';
import { Updater, useImmer } from 'use-immer';
import { nanoid } from 'nanoid';

export interface AlertData {
	readonly id: string;
	readonly severity: AlertColor;
	readonly message: string;
}

interface State {
	readonly alerts: ReadonlyArray<AlertData>;
}

type AddAlert = (severity: AlertColor, message: string) => void;
type RemoveAlert = (id: string) => void;

export interface AlertContextValue {
	readonly alerts: ReadonlyArray<AlertData>;
	readonly addAlert: AddAlert;
	readonly removeAlert: RemoveAlert;
}

export const AlertContext = createContext<AlertContextValue>({
	alerts: [],
	addAlert: () => {}, // eslint-disable-line  @typescript-eslint/no-empty-function
	removeAlert: () => {} // eslint-disable-line  @typescript-eslint/no-empty-function
});

const createAddAlert =
	(setState: Updater<State>): AddAlert =>
	(severity, message) =>
		setState((draft) => {
			draft.alerts.push({
				id: nanoid(),
				severity,
				message
			});
		});

const createRemoveAlert =
	(setState: Updater<State>): RemoveAlert =>
	(id) =>
		setState((draft) => {
			draft.alerts = draft.alerts.filter((alert) => alert.id !== id);
		});

export const AlertProvider = (props: PropsWithChildren) => {
	const [state, setState] = useImmer<State>({
		alerts: []
	});
	const value: AlertContextValue = {
		alerts: state.alerts,
		addAlert: createAddAlert(setState),
		removeAlert: createRemoveAlert(setState)
	};
	// TODO add timeout
	return (
		<AlertContext.Provider value={value}>
			{props.children}
		</AlertContext.Provider>
	);
};
