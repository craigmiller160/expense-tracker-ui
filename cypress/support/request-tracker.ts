let requests = [];
Cypress.on('request:event', (eventName: string, data: any) => {
	if (eventName === 'incoming:request') {
		requests.push(data);
	}
});

afterEach(() => {
	const { _ } = Cypress;
	const handledRequestIds = _.map(cy.state('routes'), 'requests')
		.map((request) => _.map(request, 'browserRequestId'))
		.flat();
	const results = requests.reduce(
		(acc, r) =>
			!handledRequestIds.includes(r.requestId) ? acc.concat(r.url) : acc,
		[]
	);
	requests = [];
});
