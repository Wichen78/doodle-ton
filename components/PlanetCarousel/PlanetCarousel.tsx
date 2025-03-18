// components/PlanetCarousel/PlanetCarousel.tsx

'use client';

import { FC, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './PlanetCarrousel.css';
import { useAPIUser } from '@/hooks/api/useAPIUser';
import { getInitialSlide } from '@/utils/playerUtils';

interface PlanetCarouselProps {
	onPlay: () => void;
}

const PlanetCarousel: FC<PlanetCarouselProps> = ({ onPlay }) => {
	const { balance } = useAPIUser();
	const sliderRef = useRef<Slider | null>(null);
	const initialSlide = getInitialSlide(balance);
	const settings = {
		accessibility: false,
		arrows: false,
		infinite: false,
		touchMove: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		initialSlide: initialSlide + 2,
		centerMode: true,
		focusOnSelect: false
	};

	useEffect(() => {
		if (sliderRef.current && balance.isSuccess) {
			sliderRef.current.slickGoTo(initialSlide + 2);
		}
	}, [balance]);

	const SLIDES = Array.from(Array(8).keys());
	return (
		<Slider ref={ slider => {
			sliderRef.current = slider;
		} } { ...settings }>
			<div key="0" />
			<div key="1" />
			{ SLIDES.map((index) => (
				<img key={ index + 2 } src={ `/planets/planet${ index + 1 }.svg` } alt={ `planet${ index }` }
						 className={ index === initialSlide ? 'h-20' : 'h-12' }
						 onClick={ () => index === initialSlide ? onPlay() : {} } />
			)) }
			<div key="11" />
			<div key="12" />
		</Slider>
	);
};

export default PlanetCarousel;
