import { AlertData, AlertManager, AlertSubscription } from './types';
import { nanoid } from 'nanoid';

type InternalAlertManager = AlertManager & {
	readonly subscriptions: Record<string, AlertSubscription>;
};

export const alertManager: InternalAlertManager = {
	subscriptions: {},
	addAlert(severity, message) {
		const alert: AlertData = {
			id: nanoid(),
			severity,
			message
		};
		Object.values(this.subscriptions).forEach((subscription) =>
			subscription(alert)
		);
	},
	subscribe(subscription) {
		const id = nanoid();
		this.subscriptions[id] = subscription;
		return () => {
			delete this.subscriptions[id];
		};
	}
};
