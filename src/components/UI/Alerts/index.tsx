import { For } from 'solid-js';
import Alert from '@suid/material/Alert';
import Stack from '@suid/material/Stack';
import { alertStore } from '../../../stores/AlertStore';

export const Alerts = () => {
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
