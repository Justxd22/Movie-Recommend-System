import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';

// Utility function to shuffle an array
const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const InfiniteMovieBackground = ({ posters = [] }) => {
    const rowRefs = useRef([]);
    const containerRef = useRef(null);
    const ROWS = 5;
    const ITEMS_PER_ROW = 15; // Increased for better coverage
  
    // Function to calculate screen coverage
    useEffect(() => {
      const updateScale = () => {
        if (!containerRef.current) return;
        const screenDiagonal = Math.sqrt(
          Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
        );
        const isMobile = window.innerWidth <= 768; // Define a mobile breakpoint (768px is typical)
        const scale = isMobile ? 0.5 : 1; // Set scale to 0.5 on mobile, 1 on larger screens
        containerRef.current.style.transform = `rotate(45deg) scale(${scale})`;
        
      };
  
      updateScale();
      window.addEventListener('resize', updateScale);
      return () => window.removeEventListener('resize', updateScale);
    }, []);
  
    // Duplicate posters for infinite effect
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
  
    // Create different random orders for each row
    const randomizedRows = useMemo(() => {
      
      // Create three sets of duplicated and shuffled posters for each row
      return Array(ROWS).fill(null).map(() => {
        const duplicatedPosters = [...posters, ...posters, ...posters];
        return shuffleArray(duplicatedPosters);
      });
    }, [posters]);
  
    useEffect(() => {
      let positions = Array(ROWS).fill(0);
      const speed = 4;
      const rowWidth = window.innerWidth * 2;
  
      const animate = () => {
        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          
          const direction = index % 2 === 0 ? 1 : -1;
          positions[index] += speed * direction;
          
          if (Math.abs(positions[index]) >= rowWidth) {
            positions[index] = 0;
          }
  
          gsap.set(row, { x: positions[index] });
        });
      };
  
      const animation = gsap.ticker.add(animate);
      return () => gsap.ticker.remove(animation);
    }, []);
  
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        
        {/* Movie grid */}
        <div 
          ref={containerRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center"
        >
          {randomizedRows.map((rowPosters, rowIndex) => (
            <div
              key={rowIndex}
              ref={el => rowRefs.current[rowIndex] = el}
              className="flex gap-4 my-4"
              style={{
                transform: `translateY(${rowIndex * 20}px)`, // Slight vertical offset for each row
              }}
            >
              {rowPosters.map((poster, index) => (
                <div
                  key={index}
                  className="w-48 h-72 flex-shrink-0 overflow-hidden rounded-lg opacity-60 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <img
                    src={poster}
                    alt={`Movie ${index}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default InfiniteMovieBackground;