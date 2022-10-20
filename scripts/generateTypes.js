/* eslint-disable no-console */
const { generateApi } = require('swagger-typescript-api');
const path = require('path');

const ARRAY_PATTERN = /^\((?<arrayType>.*)\)\[\]$/;

const formatDataType = (details) => {
	if (details.enum) {
		return details.enum.map((value) => `'${value}'`).join(' | ');
	}

	const parsedType = details.$parsed.content;

	if (ARRAY_PATTERN.test(parsedType)) {
		const arrayType = ARRAY_PATTERN.exec(parsedType).groups.arrayType;
		return `ReadonlyArray<${arrayType}>`;
	}

	return parsedType;
};

const formatProperties = (properties) => {
	if (!properties) {
		return '';
	}
	return Object.entries(properties)
		.map(
			([name, details]) => `readonly ${name}: ${formatDataType(details)};`
		)
		.join('\n\t');
};

// TODO handle if type is required or not
const formatType = (type) => {
	const properties = formatProperties(type.properties);
	return `export type ${type.name} = {
	${properties}
};`;
};

const formatOutput = (res) =>
	res.configuration.modelTypes
		.filter((type) => type.name !== 'Unit')
		.map(formatType)
		.join('\n\n');

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'types', 'generated');

generateApi({
	name: 'expense-tracker',
	// output: OUTPUT_PATH,
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
