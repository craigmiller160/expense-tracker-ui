const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestTsConfig = require('@craigmiller160/jest-config-ts');
const path = require('path');

// TODO update the jest-config lib
const modifiedJestConfig = {
	...jestConfig,
	transform: {
		'^.+\\.jsx?$': '@swc/jest'
	}
};

module.exports = merge(modifiedJestConfig, jestTsConfig, {
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.tsx')]
});
