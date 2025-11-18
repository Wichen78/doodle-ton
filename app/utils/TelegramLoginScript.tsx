// app/utils/TelegramLoginScript.tsx

'use client';

import { TelegramLoginData } from '@telegram-login-ultimate/react';
import TelegramLoginButton from 'react-telegram-login';
import { useLazyGetUser } from '@/hooks/api/useAPIUser';
import { jsonToTelegramInitData } from '@/utils/game-mechanics';

export const TelegramLoginScript = () => {
	const { fetchUserTelegram } = useLazyGetUser();

	const handleSuccess = (user: TelegramLoginData) => {
		fetchUserTelegram(jsonToTelegramInitData(user));
	};

	return (
		<div
			className="flex flex-col mx-auto">
			<TelegramLoginButton dataOnauth={ handleSuccess } botName={ process.env.NEXT_PUBLIC_TG_LOGIN_BOT_TOKEN } />
		</div>
	);
};
