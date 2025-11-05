export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string;
			USER_TEST: string;
			NEXT_PUBLIC_TG_LOGIN_BOT_TOKEN: number;
			NEXT_PUBLIC_ALLOW_ALL_DEVICES: boolean;
			NEXT_PUBLIC_BYPASS_TELEGRAM_AUTH: boolean;
			ENV: 'test' | 'dev' | 'prod';
		}
	}
}
