const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestTsConfig = require('@craigmiller160/jest-config-ts');
const {
	libPatterns,
	createCombinedPattern
} = require('@craigmiller160/jest-config/utils/libsToRecompile');
const path = require('path');

const config = merge(jestConfig, jestTsConfig, {
	preset: 'solid-jest/preset/browser',
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.tsx')],
	transform: {
		'^.+\\.jsx?$': 'esbuild-jest'
	}
});

module.exports = {
	...config,
	transformIgnorePatterns: [
		...config.transformIgnorePatterns.slice(1),
		createCombinedPattern([...libPatterns, 'nanoid'])
	]
};