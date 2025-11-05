// app/utils/TelegramLoginScript.tsx

'use client';

import { TelegramLoginData, useTelegramLogin } from '@telegram-login-ultimate/react';
import { useLazyGetUser } from '@/hooks/api/useAPIUser';
import { jsonToTelegramInitData } from '@/utils/game-mechanics';

export const TelegramLoginScript = () => {
	const { fetchUserTelegram } = useLazyGetUser();

	const handleSuccess = (user: TelegramLoginData) => {
		fetchUserTelegram(jsonToTelegramInitData(user));
	};

	const handleFail = () => {};

	const [openPopup, { isPending }] = useTelegramLogin({
		botId: process.env.NEXT_PUBLIC_TG_LOGIN_BOT_TOKEN,
		onSuccess: (user) => handleSuccess(user),
		onFail: () => handleFail(),
	});

	return (
		<div className="flex flex-col transform-3d">
			<button
				className="translate-y-1 px-6 py-1 mx-auto rounded-3xl text-2xl bg-blue-700 disabled:bg-gray-500 disabled:text-gray-700 shadow-button after:bg-blue-500/75 active:after:bg-blue-600/75"
				onClick={ openPopup } disabled={ isPending }>
				{ isPending ? 'Loading...' : 'Login with Telegram' }
			</button>
		</div>
	);
};
