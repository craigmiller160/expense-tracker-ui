import { For } from 'solid-js';
import Alert from '@suid/material/Alert';
import Stack from '@suid/material/Stack';
import { alertStore, removeAlert } from '../../../stores/AlertStore';
import './Alerts.scss';

export const Alerts = () => {
	return (
		<div class="Alerts">
			<Stack sx={{ width: '50%' }}>
				<For each={alertStore.alerts}>
					{(alert) => (
						<Alert
							onClose={() => removeAlert(alert.id)}
							severity={alert.type}
						>
							{alert.message}
						</Alert>
					)}
				</For>
			</Stack>
		</div>
	);
};
