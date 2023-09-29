import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ExpenseTrackerKeycloakProvider } from './components/keycloak/ExpenseTrackerKeycloakProvider';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.querySelector('#root')!);

root.render(
	<React.StrictMode>
		<BrowserRouter basename="/">
			<ExpenseTrackerKeycloakProvider>
				<App />
			</ExpenseTrackerKeycloakProvider>
		</BrowserRouter>
	</React.StrictMode>
);
