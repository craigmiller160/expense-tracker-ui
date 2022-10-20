/* eslint-disable no-console */
const { generateApi } = require('swagger-typescript-api');
const path = require('path');

// TODO how to make this readonly?

generateApi({
	name: 'expense-tracker',
	output: path.join(process.cwd(), 'src', 'types', 'generated'),
	url: 'https://127.0.0.1:8080/v3/api-docs',
	prettier: true,
	generateClient: false,
	sortTypes: true
})
	.then(() => console.log('API types successfully generated'))
	.catch((ex) => console.error('Error generating API types', ex));
