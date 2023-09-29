import { CircularProgress } from '@mui/material';
import './Fallback.scss';

export const Fallback = () => (
	<div className="suspense-fallback">
		<CircularProgress />
	</div>
);
