import { Alert, Stack } from '@mui/material';
import './Alerts.scss';
import { AlertData } from './types';
import { useImmer } from 'use-immer';
import { useCallback, useEffect } from 'react';
import { alertManager } from './AlertManager';

const ALERT_TIMEOUT = 6_000;

type State = {
	readonly alerts: ReadonlyArray<AlertData>;
	readonly timeouts: ReadonlyArray<[string, number]>;
};

export const Alerts = () => {
	const [state, setState] = useImmer<State>({
		alerts: [],
		timeouts: []
	});

	const removeAlert = useCallback(
		(id: string) =>
			setState((draft) => {
				const alertIndex = draft.alerts.findIndex(
					(alert) => alert.id === id
				);
				if (alertIndex >= 0) {
					draft.alerts.splice(alertIndex, 1);
				}

				const timeoutIndex = draft.timeouts.findIndex(
					([alertId]) => alertId === id
				);
				if (timeoutIndex >= 0) {
					clearTimeout(timeoutIndex);
				}
			}),
		[setState]
	);

	useEffect(() => {
		return alertManager.subscribe((alert) => {
			const timeout = window.setTimeout(() => {
				removeAlert(alert.id);
			}, ALERT_TIMEOUT);
			setState((draft) => {
				draft.alerts.push(alert);
				draft.timeouts.push([alert.id, timeout]);
			});
		});
	}, [setState, removeAlert]);

	return (
		<div className="alerts">
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
