import { useState, useMemo, useEffect } from 'react';
import BlurText from "./components/BlurText";
import './App.css';
import Noise from './components/Noise';
import cinema from "./assets/cinema.jpeg"
import GenreGrid from './components/geners';
import InfiniteMovieGrid from './components/GridMotion'
import Popcorn from './components/Popcorn';

const genres = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'animation', name: 'Animation' },
  { id: 'childrens', name: "Children's" },
  { id: 'comedy', name: 'Comedy' },
  { id: 'crime', name: 'Crime' },
  { id: 'documentary', name: 'Documentary' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'horror', name: 'Horror' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'romance', name: 'Romance' },
  { id: 'scifi', name: 'Sci-Fi' },
  { id: 'thriller', name: 'Thriller' },
  { id: 'shortfilm', name: 'Short Film' },
];

const items = [
  '/posters/1.jpeg',
  '/posters/2.jpeg',
  '/posters/3.jpeg',
  '/posters/4.jpeg',
  '/posters/5.jpeg',
  '/posters/6.jpeg',
  '/posters/7.jpeg',
  '/posters/8.jpeg',
  '/posters/9.jpeg',
  '/posters/10.jpeg',
  '/posters/11.jpeg',
  '/posters/12.jpeg',
  '/posters/13.jpeg',
  '/posters/14.jpeg',
  '/posters/15.jpeg',
  '/posters/16.jpeg',
  '/posters/17.jpeg',
  '/posters/18.jpeg',
  '/posters/19.jpeg',
  '/posters/20.jpeg',
  '/posters/21.jpeg',
  '/posters/22.jpeg',
  '/posters/23.jpeg',
  '/posters/24.jpeg',
  '/posters/25.jpeg',

]
const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

function App() {
  const [showGenres, setShowGenres] = useState(false); // State to toggle genre list
  const [showAni, setShowAni] = useState(false); // State to toggle genre list
  const [selectedGenres, setSelectedGenres] = useState(new Set());

  const handleButtonClick = () => {
    setShowGenres(true);
  };
  const handleButtonClickN = () => {
    setShowGenres(false);
    setShowAni(true);
  };

  const toggleGenre = (genreId) => {
    const newSelected = new Set(selectedGenres);
    if (newSelected.has(genreId)) {
      newSelected.delete(genreId);
    } else {
      newSelected.add(genreId);
    }
    setSelectedGenres(newSelected);
  };
  const genreText = useMemo(() => ["Select your favorite genres"], []);


  return (
    <>

       <div className="fixed inset-0 z-[-1]">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center opacity-100`}
          style={{ backgroundImage: `url(${cinema})` }}
        />
        <div style={{ backgroundColor: '#000000e6' }} className="absolute inset-0 bg-opacity-5" />
      </div>
      <Noise
        patternSize={250}
        patternScaleX={1.5}
        patternScaleY={1.5}
        patternRefreshInterval={2}
        patternAlpha={30}
      />


      {!showGenres && !showAni && (
        <div>
          <BlurText
            text={["Hello,", "Let's Find you a movie!"]}
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-3xl mb-8"
          />
          <button
            id="btt"
            className="bttn"
            onClick={handleButtonClick}
          >
            <span>Start</span>
          </button>
        </div>
      )} 
      {showGenres && (
        <div>
          <BlurText
            key="genres"
            text={genreText}
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-3xl mb-8"
          />
          <div className="max-w-4xl mx-auto">
          <GenreGrid genres={genres} selectedGenres={selectedGenres} toggleGenre={toggleGenre} />
          </div>

          {selectedGenres.size > 0 && (

            <button
              className="bttnNEXT"
              onClick={handleButtonClickN}
            >
              Next
            </button>
          )}
        </div>
      )}

      {showAni && (
        <div>
        <InfiniteMovieGrid posters={items} />
        <Popcorn></Popcorn>
        </div>
      )}
    </>
  );
}

export default App;
