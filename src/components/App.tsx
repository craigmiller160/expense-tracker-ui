import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

export const App = () => (
	<BrowserRouter basename="/expense-tracker">
		<CssBaseline />
	</BrowserRouter>
);
