// components/PlanetCarousel/PlanetCarousel.tsx

'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation } from 'swiper/modules';
import 'swiper/css';
import { useAPIUser } from '@/hooks/api/useAPIUser';
import { getInitialSlide } from '@/utils/playerUtils';
import './PlanetCarousel.css';

interface PlanetCarouselProps {
	onPlay: () => void;
}

const PlanetCarousel: FC<PlanetCarouselProps> = ({ onPlay }) => {
	const { balance } = useAPIUser();
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const maxSlide = getInitialSlide(balance);

	const SLIDES = Array.from(Array(8).keys());

	return (
		<div className="relative flex flex-col justify-center content-center flex-wrap h-56">
			<div className="flex flex-col transform-3d">
				<button
					className={ `translate-y-1 px-6 py-1 mx-auto rounded-3xl text-2xl bg-blue-700 disabled:bg-gray-500 disabled:text-gray-700 shadow-button ${ activeIndex > maxSlide ? 'after:bg-gray-400/75' : 'after:bg-blue-500/75 active:after:bg-blue-600/75' }` }
					onClick={ onPlay } disabled={ activeIndex > maxSlide }
				>PLAY
				</button>
			</div>
			<Swiper
				onActiveIndexChange={ (swiper) => setActiveIndex(swiper.activeIndex) }
				slidesPerView={ 5 }
				centeredSlides={ true }
				grabCursor={ true }
				modules={ [Navigation, EffectCreative] }
				effect="creative"
				creativeEffect={ {
					perspective: true,
					limitProgress: 4,
					prev: {
						translate: ['-150%', '15%', -300],
						rotate: [0, 0, -10],
						origin: 'bottom',
					},
					next: {
						translate: ['150%', '15%', -300],
						rotate: [0, 0, 10],
						origin: 'bottom',
					},
				} }
				className="w-[500px]"
			>
				{ SLIDES.map((index) => (
					<SwiperSlide key={ index }>
						<motion.div
							className="relative w-full h-32 overflow-hidden"
							initial={ { opacity: 0, scale: 0.8 } }
							animate={ { opacity: 1, scale: 1 } }
							transition={ { duration: 0.5, delay: index * 0.1 } }
						>
							<img src="/planets/shadow.svg" alt="" className="absolute w-full bottom-0 h-14" />
							<img src={ `/planets/planet${ index + 1 }.svg` } alt={ `planet${ index }` }
									 className="absolute w-full bottom-6 h-14" />
							{ index > maxSlide && (
								<img src="/locked.svg" alt="locked" className="absolute w-full h-8 bottom-9" />) }
						</motion.div>
					</SwiperSlide>
				)) }
			</Swiper>
		</div>
	);
};

export default PlanetCarousel;
