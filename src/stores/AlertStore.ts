import { createStore } from 'solid-js/store';

export interface AlertData {
	readonly type: string;
	readonly message: string;
}

export interface AlertStoreData {
	readonly alerts: ReadonlyArray<AlertData>;
}

export const [getAlertStore, setAlertStore] = createStore<AlertStoreData>({
	alerts: []
});
