const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestTsConfig = require('@craigmiller160/jest-config-ts');
const path = require('path');

// TODO update the jest-config lib
// TODO remove @swc/jest from this project and add to jest lib
const modifiedJestConfig = {
	...jestConfig,
	transform: {
		'^.+\\.js$': '@swc/jest',
		'^.+\\.ts$': [
			'@swc/jest',
			{
				jsc: {
					syntax: 'typescript'
				}
			}
		],
		'^.+\\.jsx$': [
			'@swc/jest',
			{
				jsc: {
					transform: {
						react: {
							runtime: 'automatic'
						}
					}
				}
			}
		],
		'^.+\\.tsx$': [
			'@swc/jest',
			{
				jsc: {
					parser: {
						syntax: 'typescript',
						tsx: true
					},
					transform: {
						react: {
							runtime: 'automatic'
						}
					}
				}
			}
		]
	}
};

// TODO update the jest-config-ts lib
delete jestTsConfig.transform;
delete jestTsConfig.globals;

module.exports = merge(modifiedJestConfig, jestTsConfig, {
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.tsx')]
});
