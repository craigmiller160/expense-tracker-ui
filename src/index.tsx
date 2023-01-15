import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { KeycloakAuthProvider } from './components/KeycloakAuthProvider';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.querySelector('#root')!);

root.render(
	<React.StrictMode>
		<BrowserRouter basename="/">
			{/*<App />*/}
			<KeycloakAuthProvider />
		</BrowserRouter>
	</React.StrictMode>
);
