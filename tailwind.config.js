const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				chevronDown: '/src/assets/required/chevron-down.svg',
				chevronDownDark: '/src/assets/required/dark:chevron-down.svg',
			},
			transitionProperty: {
				margin: 'margin',
			},
		},
	},
	safelist: [
		{
			pattern: /(bg|border|text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
			variants: ['hover', 'active', 'checked', 'indeterminate', 'dark:hover', 'peer-checked'],
		},
		{
			pattern: /(bg|border|text)-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)$/,
			variants: ['hover', 'active', 'checked', 'indeterminate', 'dark:hover', 'peer-checked'],
		},
		{
			pattern: /(border|text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)\/(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/,
			variants: ['hover', 'active', 'checked', 'indeterminate', 'dark:hover', 'peer-checked'],
		},
		{
			pattern: /(border|text)-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)\/(50)$/,
			variants: ['hover', 'active', 'checked', 'indeterminate', 'dark:hover', 'peer-checked'],
		},
	],
	plugins: [require('@tailwindcss/typography')],
	darkMode: 'class',
};
