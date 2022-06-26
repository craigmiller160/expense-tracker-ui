import { For } from 'solid-js';
import Alert from '@suid/material/Alert';
import Stack from '@suid/material/Stack';
import { alertStore, updateAlertStore } from '../../../stores/AlertStore';

export const Alerts = () => {
	// TODO delete this
	updateAlertStore((prev) => ({
		...prev,
		alerts: [
			{ type: 'error', message: 'One' },
			{ type: 'success', message: 'Two' }
		]
	}));
	return (
		<Stack sx={{ width: '100%' }}>
			<For each={alertStore.alerts}>
				{(alert) => (
					<Alert severity={alert.type}>{alert.message}</Alert>
				)}
			</For>
		</Stack>
	);
};
