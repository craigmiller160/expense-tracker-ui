type ProxyRequest = Readonly<{
	flags: Readonly<{
		stubbed: boolean;
	}>;
	preRequest: Readonly<{
		method: string;
		url: string;
	}>;
}>;

type ProxyLogging = Readonly<{
	proxyRequests: ReadonlyArray<ProxyRequest>;
}>;

/**
 * Ugly but the only way to access these internal APIs
 */
const getProxyLogging = (): ProxyLogging =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	(Cypress as any).ProxyLogging as ProxyLogging;

afterEach(() => {
	const proxyLogging = getProxyLogging();
	const callsNotMocked = proxyLogging.proxyRequests
		.filter((req) => !req.flags.stubbed)
		.map((req) => `${req.preRequest.method} ${req.preRequest.url}`);
	expect(callsNotMocked).to.have.length(0);
});
