// assets/icons/Mine.tsx

import { FC } from 'react';
import { IconProps } from '@/types';

const Mine: FC<IconProps> = ({ size = 24, className = '' }) => {

	const svgSize = `${ size }px`;

	return (
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor"
				 className={ className }
				 height={ svgSize } width={ svgSize }>
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path
					d="M11.707,17.707c-0.195-0.195-0.451-0.293-0.707-0.293s-0.512,0.098-0.707,0.293l-6.586,6.586 C3.512,24.488,3.256,24.586,3,24.586s-0.512-0.098-0.707-0.293l-0.637-0.637c-0.973-0.973-1.159-2.484-0.451-3.665L6,12L3,9 L2.391,7.173c-0.24-0.719-0.052-1.511,0.483-2.047l2.252-2.252C5.507,2.493,6.018,2.288,6.54,2.288c0.212,0,0.425,0.034,0.632,0.103 L9,3l3,3l7.991-4.795c0.479-0.287,1.013-0.428,1.542-0.428c0.776,0,1.544,0.3,2.122,0.879l0.637,0.637 c0.391,0.391,0.391,1.024,0,1.414l-6.586,6.586c-0.391,0.391-0.391,1.024,0,1.414l0.586,0.586c0.383,0.383,0.385,0.997,0.017,1.389 l-4.628,4.628C13.49,18.49,13.246,18.586,13,18.586c-0.256,0-0.512-0.098-0.707-0.293L11.707,17.707z M30.586,26.586L18.707,14.707 l-4,4l11.879,11.879c0.391,0.391,0.902,0.586,1.414,0.586s1.024-0.195,1.414-0.586l1.172-1.172 C31.367,28.633,31.367,27.367,30.586,26.586z"></path>
			</g>
		</svg>
	);
};

export default Mine;
