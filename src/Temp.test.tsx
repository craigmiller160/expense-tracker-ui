import { test } from 'vitest';
import { render, screen } from 'solid-testing-library';
import '@testing-library/jest-dom';
import { App } from './components/App';
// TODO delete this

test('Experiment', () => {
	render(() => <App />);
});
