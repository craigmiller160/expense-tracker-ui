import Chainable = Cypress.Chainable;
import { match, P } from 'ts-pattern';
import {
	getAuthUser_isAuthorized,
	getAuthUser_isNotAuthorized
} from './apis/oauth';
import { App } from '../../../src/components/App';
import { MemoryRouter } from 'react-router-dom';

const desktopViewport = (): Chainable<null> => cy.viewport(1920, 1080);
const mobileViewport = (): Chainable<null> => cy.viewport(500, 500);

export type MountViewport = 'desktop' | 'mobile';

export type MountConfig = {
	readonly viewport: MountViewport;
	readonly isAuthorized: boolean;
	readonly initialRoute: string;
};

export const defaultConfig: MountConfig = {
	viewport: 'desktop',
	isAuthorized: true,
	initialRoute: '/expense-tracker'
};
const handleViewport = (config?: Partial<MountConfig>): Chainable<null> =>
	match(config)
		.with(undefined, desktopViewport)
		.with({ viewport: 'desktop' }, desktopViewport)
		.otherwise(mobileViewport);
const handleIsAuthorized = (config?: Partial<MountConfig>): Chainable<null> =>
	match(config)
		.with(undefined, getAuthUser_isAuthorized)
		.with({ isAuthorized: true }, getAuthUser_isAuthorized)
		.otherwise(getAuthUser_isNotAuthorized);
const getInitialEntries = (config?: Partial<MountConfig>): string[] =>
	match(config)
		.with(undefined, () => ['/expense-tracker'])
		.with({ initialRoute: P.string }, ({ initialRoute }) => [initialRoute])
		.otherwise(() => ['/expense-tracker']);

export const mountApp = (config?: Partial<MountConfig>): Chainable<unknown> => {
	handleViewport(config);
	handleIsAuthorized(config);
	const initialEntries = getInitialEntries(config);
	return cy.mount(
		<MemoryRouter initialEntries={initialEntries}>
			<App />
		</MemoryRouter>
	);
};
