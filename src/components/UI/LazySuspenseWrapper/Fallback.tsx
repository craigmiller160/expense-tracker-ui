import { CircularProgress } from '@mui/material';
import './Fallback.scss';

export const Fallback = () => (
	<div className="SuspenseFallback">
		<CircularProgress />
	</div>
);
