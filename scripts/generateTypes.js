/* eslint-disable no-console */
const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const spawn = require('cross-spawn');

const result = spawn.sync(
	'swagger-typescript-api',
	[
		'-p',
		'https://127.0.0.1:8080/v3/api-docs',
		'-o',
		path.join(process.cwd(), 'src', 'types', 'generated'),
		'-n',
		'expense-tracker',
		'--union-enums',
		'--no-client',
		'--add-readonly '
	],
	{
		stdio: 'inherit',
		env: {
			NODE_TLS_REJECT_UNAUTHORIZED: 0
		}
	}
);
process.exit(result.status);

// TODO how to make this readonly?

// generateApi({
// 	name: 'expense-tracker',
// 	output: path.join(process.cwd(), 'src', 'types', 'generated'),
// 	url: 'https://127.0.0.1:8080/v3/api-docs',
// 	prettier: true,
// 	generateClient: false,
// 	sortTypes: true
// })
// 	.then(() => console.log('API types successfully generated'))
// 	.catch((ex) => console.error('Error generating API types', ex));
