import { createStore } from 'solid-js/store';
import { AlertColor } from '@suid/material/Alert';

export interface AlertData {
	readonly type: AlertColor;
	readonly message: string;
}

export interface AlertStoreData {
	readonly alerts: ReadonlyArray<AlertData>;
}

export const [alertStore, updateAlertStore] = createStore<AlertStoreData>({
	alerts: []
});
