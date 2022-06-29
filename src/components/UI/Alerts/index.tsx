import { Alert, Stack } from '@mui/material';
import './Alerts.scss';
import { useContext, useEffect } from 'react';
import { AlertContext } from './AlertProvider';

export const Alerts = () => {
	const alertContext = useContext(AlertContext);
	useEffect(() => {
		alertContext.addAlert('error', 'Hello World');
	}, []);

	return (
		<div className="Alerts">
			<Stack sx={{ width: '50%' }}>
				{alertContext.alerts.map((alert) => (
					<Alert
						onClose={() => alertContext.removeAlert(alert.id)}
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
