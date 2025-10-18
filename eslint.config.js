const eslint = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
	{
		ignores: ['**/eslint.config.js'],
	},

	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	//...tseslint.configs.stylisticTypeChecked,
	eslintConfigPrettier,

	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},

			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
		},
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",
			//"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/unbound-method": "off",
			"no-console": "off",
			"prettier/prettier": "off",
			"no-unused-vars": "off",
			"no-useless-escape": "off",
			"no-prototype-builtins": "off",
			"no-case-declarations": "off",
		},
	},
]