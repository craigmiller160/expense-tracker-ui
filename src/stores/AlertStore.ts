import { createStore } from 'solid-js/store';
import { AlertColor } from '@suid/material/Alert';
import { nanoid } from 'nanoid';

const ALERT_TIMEOUT = 6_000;

export interface AlertData {
	readonly id: string;
	readonly type: AlertColor;
	readonly message: string;
}

export interface AlertStoreData {
	readonly alerts: ReadonlyArray<AlertData>;
}

export const [alertStore, updateAlertStore] = createStore<AlertStoreData>({
	alerts: []
});

export const removeAlert = (id: string): void =>
	updateAlertStore((prev) => ({
		...prev,
		alerts: prev.alerts.filter((alert) => alert.id !== id)
	}));

export const addAlert = (type: AlertColor, message: string): void => {
	const id = nanoid();
	setTimeout(() => removeAlert(id), ALERT_TIMEOUT);
	updateAlertStore((prev) => ({
		...prev,
		alerts: [
			...prev.alerts,
			{
				id,
				type,
				message
			}
		]
	}));
};
