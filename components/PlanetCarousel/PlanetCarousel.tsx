// components/PlanetCarousel/PlanetCarousel.tsx

'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation } from 'swiper/modules';
import 'swiper/css';
import { useAPIUser } from '@/hooks/api/useAPIUser';
import { getInitialSlide } from '@/utils/playerUtils';

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
			<button
				className="block bg-sky-400 text-white font-semibold py-2 px-4 mx-auto rounded disabled:bg-gray-300 disabled:text-gray-500"
				onClick={ onPlay } disabled={ activeIndex > maxSlide }
			>PLAY
			</button>
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
