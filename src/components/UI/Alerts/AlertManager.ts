import { AlertData, AlertManager, AlertSubscription } from './types';
import crypto from 'crypto';

type InternalAlertManager = AlertManager & {
	readonly subscriptions: Record<string, AlertSubscription>;
};

export const alertManager: InternalAlertManager = {
	subscriptions: {},
	addAlert(severity, message) {
		const alert: AlertData = {
			id: crypto.randomUUID(),
			severity,
			message
		};
		Object.values(this.subscriptions).forEach((subscription) =>
			subscription(alert)
		);
	},
	subscribe(subscription) {
		const id = crypto.randomUUID();
		this.subscriptions[id] = subscription;
		return () => {
			delete this.subscriptions[id];
		};
	}
};
