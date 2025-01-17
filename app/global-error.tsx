// app/global-error.tsx

'use client';

import { FC } from 'react';

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

const GlobalError: FC<GlobalErrorProps> = ({ error, reset, }) => {
	console.log('Error caught by boundary:', error);
	return (
		<html>
		<body>
			<h2>Something went wrong!</h2>
			<button onClick={ () => reset() }>Try again</button>
		</body>
		</html>
	);
};

export default GlobalError;
