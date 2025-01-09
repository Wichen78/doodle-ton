/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			keyframes: {
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				'slide-down': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100%)' },
				}
			},
			animation: {
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-in',
			}
		},
	},
	plugins: [],
};
