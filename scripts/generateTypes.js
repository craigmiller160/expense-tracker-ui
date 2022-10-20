/* eslint-disable no-console */
const { generateApi } = require('swagger-typescript-api');
const path = require('path');

const ARRAY_PATTERN = /^\(.*\)\[\]$/;

const formatDataType = (parsedType) => {
	if (ARRAY_PATTERN.test(parsedType)) {
		return 'ReadonlyArray<string>';
	}
	return parsedType;
};

const formatType = (type) => `
	export type ${type.name} = {
		${
			type.properties &&
			Object.entries(type.properties)
				.map(
					([name, details]) =>
						`readonly ${name}: ${formatDataType(
							details.$parsed.content
						)};`
				)
				.join('\n')
		}
	};
`;

const formatOutput = (res) =>
	res.configuration.modelTypes.map(formatType).join('\n\n');

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'types', 'generated');

generateApi({
	name: 'expense-tracker',
	url: 'https://127.0.0.1:8080/v3/api-docs',
	prettier: true,
	generateClient: false,
	sortTypes: true
})
	.then((res) => {
		const newOutput = formatOutput(res);
		res.createFile({
			path: OUTPUT_PATH,
			fileName: 'expense-tracker.ts',
			content: newOutput
		});
		console.log('API types successfully generated');
	})
	.catch((ex) => console.error('Error generating API types', ex));
