module.exports = {
	extends: [
		'@craigmiller160/eslint-config-js',
		'@craigmiller160/eslint-config-prettier',
		'@craigmiller160/eslint-config-jest',
		'@craigmiller160/eslint-config-react',
		'@craigmiller160/eslint-config-ts',
		'plugin:cypress/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended'
	],
	rules: {
		'cypress/no-unnecessary-waiting': 0
	}
};
