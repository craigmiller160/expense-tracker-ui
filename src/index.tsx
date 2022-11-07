import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { BrowserRouter } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.querySelector('#root')!);

root.render(
	<React.StrictMode>
		<BrowserRouter basename="/">
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
