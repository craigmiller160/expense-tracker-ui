import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';

export const App = () => (
	<BrowserRouter basename="/expense-tracker">
		<CssBaseline />
		<Navbar />
	</BrowserRouter>
);
