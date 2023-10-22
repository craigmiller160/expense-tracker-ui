import type { AlertData, AlertManager, AlertSubscription } from './types';
import { v4 as uuidv4 } from 'uuid';

type InternalAlertManager = AlertManager & {
	readonly subscriptions: Record<string, AlertSubscription>;
};

export const alertManager: InternalAlertManager = {
	subscriptions: {},
	addAlert(severity, message) {
		const alert: AlertData = {
			id: uuidv4(),
			severity,
			message
		};
		Object.values(this.subscriptions).forEach((subscription) =>
			subscription(alert)
		);
	},
	subscribe(subscription) {
		const id = uuidv4();
		this.subscriptions[id] = subscription;
		return () => {
			delete this.subscriptions[id];
		};
	}
};
