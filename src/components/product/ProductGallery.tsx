import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, Maximize2Icon, XIcon } from 'lucide-react';
import { ProductImage } from '../../types/catalog';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{x: number;y: number;} | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);
  const multi = images.length > 1;

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length), [images.length]);

  useEffect(() => setIndex(0), [images]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, go]);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || !multi) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const current = images[index];
  const arrow = 'absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-luxe transition-transform duration-150 ease-luxe active:scale-90';

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {multi &&
      <div className="no-scrollbar flex gap-3 overflow-x-auto lg:w-20 lg:shrink-0 lg:flex-col" role="tablist" aria-label="Product images">
          {images.map((img, i) =>
        <button
          key={img.src}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`View image ${i + 1}`}
          onClick={() => setIndex(i)}
          className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ivory transition-opacity duration-150 lg:w-full ${
          i === index ? 'opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-bg' : 'opacity-55 hover:opacity-100'}`
          }>
          
              <img src={img.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </button>
        )}
        </div>
      }

      <div className="relative flex-1">
        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-ivory"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onTouchStart={(e) => touchX.current = e.touches[0].clientX}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(true)}>
          
          <AnimatePresence initial={false}>
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out"
              style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            
          </AnimatePresence>
        </div>
        {multi &&
        <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-3`}>
              <ChevronLeftIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-3`}>
              <ChevronRightIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </>
        }
        <div className="pointer-events-none absolute bottom-3 left-3 bg-white/90 px-2.5 py-1 text-[11px] tracking-[0.14em] text-luxe">
          {index + 1} / {images.length}
        </div>
        <button type="button" onClick={() => setLightbox(true)} aria-label="Open full screen gallery" className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center bg-white/90 text-luxe">
          <Maximize2Icon className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {lightbox &&
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          className="fixed inset-0 z-[80] flex flex-col bg-[#0B0B0A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          
            <div className="flex items-center justify-between px-5 py-4 text-white/80">
              <span className="text-[12px] tracking-[0.16em]">
                {index + 1} / {images.length}
              </span>
              <button type="button" onClick={() => setLightbox(false)} aria-label="Close gallery" className="p-2 hover:text-white">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="relative flex-1" onTouchStart={(e) => touchX.current = e.touches[0].clientX} onTouchEnd={onTouchEnd}>
              <img src={current.src} alt={current.alt} className="absolute inset-0 h-full w-full object-contain" />
              {multi &&
            <>
                  <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-4`}>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-4`}>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
            }
            </div>
            {multi &&
          <div className="flex justify-center gap-3 p-4">
                {images.map((img, i) =>
            <button key={img.src} type="button" onClick={() => setIndex(i)} aria-label={`View image ${i + 1}`} className={`h-16 w-12 overflow-hidden ${i === index ? 'ring-1 ring-[#D4AF37]' : 'opacity-50'}`}>
                    <img src={img.src} alt="" className="h-full w-full object-cover" />
                  </button>
            )}
              </div>
          }
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}