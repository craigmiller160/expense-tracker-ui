import { match, P } from 'ts-pattern';
import { App } from '../../../src/components/App';
import { MemoryRouter } from 'react-router-dom';
import type { KeycloakAuth } from '@craigmiller160/react-keycloak';
import { KeycloakAuthContext } from '@craigmiller160/react-keycloak';
import { newQueryClient } from '../../../src/ajaxapi/query/queryClient';
import type { MountReturn } from 'cypress/react';

type Chainable<T> = Cypress.Chainable<T>;

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
		.with({ viewport: 'mobile' }, mobileViewport)
		.otherwise(desktopViewport);
const getInitialEntries = (config?: Partial<MountConfig>): string[] =>
	match(config)
		.with(undefined, () => ['/expense-tracker'])
		.with({ initialRoute: P.string }, ({ initialRoute }) => [initialRoute])
		.otherwise(() => ['/expense-tracker']);

export const mountApp = (
	config?: Partial<MountConfig>
): Chainable<MountReturn> => {
	const keycloakAuth: KeycloakAuth = {
		status: 'authorized',
		isPostAuthorization: true,
		isPreAuthorization: false,

		logout: () => {}
	};
	handleViewport(config);
	const initialEntries = getInitialEntries(config);
	const queryClient = newQueryClient();
	return (
		cy
			.mount(
				<MemoryRouter initialEntries={initialEntries}>
					<KeycloakAuthContext.Provider value={keycloakAuth}>
						<App queryClient={queryClient} />
					</KeycloakAuthContext.Provider>
				</MemoryRouter>
			)
			// eslint-disable-next-line cypress/no-unnecessary-waiting
			.then((res) => cy.wait(100).then(() => res))
	);
};
