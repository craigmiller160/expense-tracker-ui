import { AlertColor } from '@mui/material';

export type AlertData = {
	readonly id: string;
	readonly severity: AlertColor;
	readonly message: string;
};

export type AddAlert = (severity: AlertColor, message: string) => void;
export type RemoveAlert = (id: string) => void;
export type AlertSubscription = {
	readonly unsubscribe: () => void;
};
export type SubscribeForAlerts = (alertData: AlertData) => AlertSubscription;

export type AlertManager = {
	readonly addAlert: AddAlert;
	readonly removeAlert: RemoveAlert;
	readonly subscribe: SubscribeForAlerts;
};
