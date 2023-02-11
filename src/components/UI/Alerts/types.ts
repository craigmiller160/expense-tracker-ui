import { AlertColor } from '@mui/material';

export type AlertData = {
	readonly id: string;
	readonly severity: AlertColor;
	readonly message: string;
};

export type AddAlert = (severity: AlertColor, message: string) => void;
export type RemoveAlert = (id: string) => void;
export type AlertUnsubscribe = () => void;
export type AlertSubscription = (alertData: AlertData) => void;
export type SubscribeForAlerts = (
	subscription: AlertSubscription
) => AlertUnsubscribe;

export type AlertManager = {
	readonly addAlert: AddAlert;
	readonly subscribe: SubscribeForAlerts;
};
