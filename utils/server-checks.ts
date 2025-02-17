// utils/server-checks.ts

interface ValidatedData {
	[key: string]: string;
}

interface User {
	id?: string;
	username?: string;
	first_name?: string;
}

interface ValidationResult {
	validatedData: ValidatedData | null;
	user: User;
	message: string;
}

export function validateTelegramWebAppData(telegramInitData: string): ValidationResult {
	let validatedData: ValidatedData | null = null;
	let user: User = {};
	let message = '';

	console.log('telegramInitData', telegramInitData);

	if (process.env.NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH === 'true') {
		validatedData = { temp: '' };
		user = { id: 'undefined', username: 'Unknown User' };
		message = 'Authentication bypassed for development';
	} else {
		const initData = new URLSearchParams(telegramInitData);
		const hash = initData.get('hash');

		if (!hash) {
			return { message: 'Hash is missing from initData', validatedData: null, user: {} };
		}

		initData.delete('hash');

		// Check if auth_date is present and not older than 1 week
		const authDate = initData.get('auth_date');
		if (!authDate) {
			return { message: 'auth_date is missing from initData', validatedData: null, user: {} };
		}

		const authTimestamp = parseInt(authDate, 10);
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const timeDifference = currentTimestamp - authTimestamp;
		const OneWeekInSeconds = 7 * 24 * 60 * 60;

		if (timeDifference > OneWeekInSeconds) {
			return { message: 'Telegram data is older than 1 week', validatedData: null, user: {} };
		}

		validatedData = Object.fromEntries(initData.entries());
		message = 'Validation successful';
		const userString = validatedData['user'];
		if (userString) {
			try {
				user = JSON.parse(userString);
				console.log('Parsed user data:', user);
			} catch (error) {
				console.error('Error parsing user data:', error);
				message = 'Error parsing user data';
				validatedData = null;
			}
		} else {
			message = 'User data is missing';
			validatedData = null;
		}
	}

	return { validatedData, user, message };
}
