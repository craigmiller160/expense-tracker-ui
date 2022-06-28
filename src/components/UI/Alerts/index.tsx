import { AlertColor } from '@mui/material';
import './Alerts.scss';

export interface AlertData {
	readonly id: string;
	readonly severity: AlertColor;
	readonly message: string;
}

export interface AlertContextValue {
	readonly alerts: ReadonlyArray<AlertData>;
	readonly addAlert: (severity: AlertColor, message: string) => void;
	readonly removeAlerts: (id: string) => void;
}

export const Alerts = () => {
	return <></>;
};
