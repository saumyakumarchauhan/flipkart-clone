import React, { useEffect, useRef } from 'react';

const Banner = () => {
  const banners = [
    '/images/b1.jpg',
    '/images/b2.jpg',
    '/images/b3.jpg',
    '/images/b4.jpg',
    '/images/b5.jpg',
    '/images/b6.jpg',
    '/images/b7.jpg',
    '/images/b8.jpg'
  ];

  const scrollRef = useRef(null);

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we've reached the end of the scroll, instantly snap back to the start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll forward by the width of one image card + the gap (16px)
          const firstChild = scrollRef.current.firstElementChild;
          if (firstChild) {
            scrollRef.current.scrollBy({ left: firstChild.clientWidth + 16, behavior: 'smooth' });
          }
        }
      }
    }, 3000); // Slides every 3 seconds

    return () => clearInterval(timer);
  }, []);

  // Manual Arrow Click Logic
  const scroll = (direction) => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.firstElementChild;
      const scrollAmount = firstChild ? firstChild.clientWidth + 16 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full mb-6 group">
      
      {/* Scrollable Track */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {banners.map((img, idx) => (
          <div 
            key={idx} 
            /* Responsive sizing: 1 image on mobile, 2 on tablet, 3 on desktop */
            className="snap-start w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] flex-shrink-0 h-[200px] md:h-[240px] rounded-lg overflow-hidden cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.08)] border border-gray-100 bg-white"
          >
            <img 
              src={img} 
              alt={`Promo ${idx + 1}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out" 
            />
          </div>
        ))}
      </div>

      {/* Left Navigation Arrow */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-6 shadow-[3px_0_6px_rgba(0,0,0,0.15)] rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      {/* Right Navigation Arrow */}
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 px-3 py-6 shadow-[-3px_0_6px_rgba(0,0,0,0.15)] rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      {/* CSS to physically hide the scrollbar track on Chrome/Safari/Edge */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
};

export default Banner;