// components/Loading/Loading.tsx

'use client';

import React, { FC } from 'react';

const Loading: FC = () => {
	return (
		<div className="w-full h-screen max-w-xl flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Loading...</h1>
		</div>
	);
};

export default Loading;
