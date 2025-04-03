// components/PlanetCarousel/PlanetCarousel.tsx

'use client';

import { FC } from 'react';
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
	const maxSlide = getInitialSlide(balance);

	const SLIDES = Array.from(Array(8).keys());

	return (
		<div className="relative flex justify-center h-44">
			<Swiper
				slidesPerView={ 5 }
				centeredSlides={ true }
				grabCursor={ true }
				modules={ [Navigation, EffectCreative] }
				effect="creative"
				creativeEffect={ {
					perspective: true,
					limitProgress: 4,
					prev: {
						translate: ["-150%", "15%", -300],
						rotate: [0, 0, -10],
						origin: "bottom",
					},
					next: {
						translate: ["150%", "15%", -300],
						rotate: [0, 0, 10],
						origin: "bottom",
					},
				} }
				className="w-[500px]"
			>
				{ SLIDES.map((index) => (
					<SwiperSlide key={ index }>
						{ ({ isActive }) => (
							<motion.div
								className="relative w-full h-32 overflow-hidden"
								initial={ { opacity: 0, scale: 0.8 } }
								animate={ { opacity: 1, scale: 1 } }
								transition={ { duration: 0.5, delay: index * 0.1 } }
							>
								<img src="/planets/shadow.svg" alt="" className="absolute w-full bottom-0 h-14" />
								<img src={ `/planets/planet${ index + 1 }.svg` } alt={ `planet${ index }` }
										 className="absolute w-full bottom-6 h-14"
										 onClick={ () => isActive && index <= maxSlide ? onPlay() : {} } />
								{ index > maxSlide && (
									<img src="/locked.svg" alt="locked" className="absolute w-full h-8 bottom-9" />) }
							</motion.div>
						) }
					</SwiperSlide>
				)) }
			</Swiper>
		</div>
	);
};

export default PlanetCarousel;
