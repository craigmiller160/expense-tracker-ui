import { createContext, PropsWithChildren } from 'react';
import { Updater, useImmer } from 'use-immer';
import { nanoid } from 'nanoid';
import { AddAlert, AlertData, RemoveAlert } from './types';

const ALERT_TIMEOUT = 6_000;

interface State {
	readonly alerts: ReadonlyArray<AlertData>;
}

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

// TODO probably delete all this and move to new alert manager
const createAddAlert =
	(setState: Updater<State>, removeAlert: RemoveAlert): AddAlert =>
	(severity, message) => {
		const id = nanoid();
		setTimeout(() => {
			removeAlert(id);
		}, ALERT_TIMEOUT);
		setState((draft) => {
			draft.alerts.push({
				id,
				severity,
				message
			});
		});
	};

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
	const removeAlert = createRemoveAlert(setState);
	const value: AlertContextValue = {
		alerts: state.alerts,
		addAlert: createAddAlert(setState, removeAlert),
		removeAlert
	};
	return (
		<AlertContext.Provider value={value}>
			{props.children}
		</AlertContext.Provider>
	);
};
