import { createContext, PropsWithChildren } from 'react';
import { AlertColor } from '@mui/material';
import { useImmer } from 'use-immer';
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
	addAlert: () => {},
	removeAlert: () => {}
});

export const AlertProvider = (props: PropsWithChildren) => {
	const [state, setState] = useImmer<State>({
		alerts: []
	});
	const addAlert: AddAlert = (severity, message) =>
		setState((draft) => {
			draft.alerts.push({
				id: nanoid(),
				severity,
				message
			});
		});
	const removeAlert: RemoveAlert = (id) =>
		setState((draft) => {
			draft.alerts = draft.alerts.filter((alert) => alert.id !== id);
		});
	const value: AlertContextValue = {
		alerts: state.alerts,
		addAlert,
		removeAlert
	};
	return (
		<AlertContext.Provider value={value}>
			{props.children}
		</AlertContext.Provider>
	);
};
