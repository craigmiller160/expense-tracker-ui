import CssBaseline from '@suid/material/CssBaseline';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { Alerts } from './UI/Alerts';

export const App = () => (
	<>
		<CssBaseline />
		<Navbar />
		<Alerts />
		<Content />
	</>
);
