import CssBaseline from '@suid/material/CssBaseline';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { Alerts } from './UI/Alerts';
import { Router } from 'solid-app-router';

export const App = () => (
	<Router base="/expense-tracker">
		<CssBaseline />
		<Navbar />
		<Alerts />
		<Content />
	</Router>
);
