const { generateApi } = require('swagger-typescript-api');
const path = require('path');

generateApi({
	name: 'expense-tracker',
	output: path.join(process.cwd(), 'src', 'types', 'generated.ts'),
	url: 'https://locahost:8080/v3/api-docs',
	prettier: true,
	generateClient: false
})
	.then(() => console.log('API types successfully generated'))
	.catch((ex) => console.error('Error generating API types', ex));
