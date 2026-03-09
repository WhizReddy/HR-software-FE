import React, { useCallback, useEffect, useState } from 'react';
import styles from './Carousel.module.css'


interface Image {
    src: string
    alt: string
    name?: string
}

interface ImageCarouselProps {
    images: Image[]
    autoPlay?: boolean
    autoPlayInterval?: number
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    autoPlay = true,
    autoPlayInterval = 3000,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, [images.length])

    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length,
        )
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    useEffect(() => {
        if (autoPlay && !isHovered) {
            const interval = setInterval(nextSlide, autoPlayInterval);
            return () => clearInterval(interval);
        }
    }, [autoPlay, isHovered, autoPlayInterval, nextSlide]);

    return (
        <div
            className={styles.carouselContainer}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div 
                className={styles.carouselInner} 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className={styles.carouselItem}>
                        <img src={image.src} alt={image.alt} className={styles.carouselImage} />
                        {image.name && <p className={styles.imageName}>{image.name}</p>}
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className={`${styles.carouselButton} ${styles.prev}`}
            >
                &lt;
            </button>
            <button
                onClick={nextSlide}
                className={`${styles.carouselButton} ${styles.next}`}
            >
                &gt;
            </button>

            <div className={styles.dotsContainer}>
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ImageCarousel;
