import { Alert, Stack } from '@mui/material';
import './Alerts.scss';
import { AlertData } from './types';
import { useImmer } from 'use-immer';

type State = {
	readonly alerts: ReadonlyArray<AlertData>;
};

export const Alerts = () => {
	const [state, setState] = useImmer<State>({
		alerts: []
	});

	const removeAlert = (id: string) =>
		setState((draft) => {
			const index = draft.alerts.findIndex((alert) => alert.id === id);
			if (index >= 0) {
				draft.alerts.splice(index, 1);
			}
		});

	return (
		<div className="Alerts">
			<Stack sx={{ width: '50%' }}>
				{state.alerts.map((alert) => (
					<Alert
						onClose={() => removeAlert(alert.id)}
						key={alert.id}
						severity={alert.severity}
					>
						{alert.message}
					</Alert>
				))}
			</Stack>
		</div>
	);
};
