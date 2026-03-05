import React, { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/Components/ui/carousel'

interface CarouselProps {
    images?: string[]
    children?: React.ReactNode
}

const Example: React.FC<CarouselProps> = ({ images = [], children }) => {
    const [api, setApi] = useState<any>()
    const [current, setCurrent] = useState(0)

    React.useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on('select', () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    if (!images || images.length === 0) {
        return (
            <div className="w-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center min-h-[200px] text-slate-400 text-sm">
                {children || 'No images'}
            </div>
        )
    }

    const prev = () => api?.scrollPrev()
    const next = () => api?.scrollNext()
    const scrollTo = (index: number) => api?.scrollTo(index)

    return (
        <Carousel setApi={setApi} className="w-full overflow-hidden rounded-xl bg-slate-900">
            <CarouselContent className="ml-0">
                {images.map((image, i) => {
                    const imageUrl = image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}${image}`
                    return (
                        <CarouselItem key={image + i} className="pl-0">
                            <img src={imageUrl} alt={`slide-${i}`} className="max-h-72 w-full object-cover" />
                        </CarouselItem>
                    )
                })}
            </CarouselContent>

            {images.length > 1 && (
                <>
                    <CarouselPrevious
                        onClick={prev}
                        className="left-2 top-1/2 h-8 w-8 -translate-y-1/2 border-none bg-black/40 text-white hover:bg-black/60"
                    />
                    <CarouselNext
                        onClick={next}
                        className="right-2 top-1/2 h-8 w-8 -translate-y-1/2 border-none bg-black/40 text-white hover:bg-black/60"
                    />
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => scrollTo(i)}
                                className={`h-2 w-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </Carousel>
    )
}

export default Example
