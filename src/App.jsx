import React, { useState, useEffect } from "react"
import "./App.css"
import loading from "./loading.svg"
import runtime from "./movie_icons/clock-1-svgrepo-com.svg"
import rated from "./movie_icons/community-svgrepo-com.svg"
import released from "./movie_icons/date-svgrepo-com.svg"
import star from "./movie_icons/star-svgrepo-com.svg"
import actorsIMG from "./movie_icons/theater-mask-svgrepo-com.svg"
import writersIMG from "./movie_icons/edit-square-svgrepo-com.svg"
import awardsIMG from "./movie_icons/award-simple-svgrepo-com.svg"
import ratingsIMG from "./movie_icons/rating-rate-svgrepo-com.svg"

const API_URL = "https://www.omdbapi.com/?apikey=cfed24b2"

const App = () => {
  // Hooks

  const [query, setQuery] = useState("")

  const [moviesArr, setMoviesArr] = useState([])

  const [fetchErr, setFetchErr] = useState(false)

  const [movieRoute, setMovieRoute] = useState(false)

  const [oneMovie, setOneMovie] = useState({})

  useEffect(() => {
    fetchMovies("Batman").then((movies) => setMoviesArr(movies))
  }, [])

  // Functions

  const fetchMovies = async (query) => {
    const response = await fetch(`${API_URL}&i=tt3896198&s=${query}`)
    const data = await response.json()
    setFetchErr(data.Response === "False")
    return data.Search || []
  }

  const fetchOneMovie = async (movieId) => {
    setMoviesArr([])
    const response = await fetch(`${API_URL}&i=${movieId}`)
    const data = await response.json()
    if (data.Response === "True") {
      setMovieRoute(true)
      setOneMovie(data)
      return
    }
    setMovieRoute(false)
    setOneMovie({})
  }

  const handleSearchClick = () => {
    if (!query.trim()) return
    setFetchErr(false)
    setMoviesArr([])
    setMovieRoute(false)
    setOneMovie({})
    fetchMovies(query).then((movies) => setMoviesArr(movies))
  }

  const handleInputChange = (value) => setQuery(value)

  const handleClick = (movieId) => fetchOneMovie(movieId)

  // Render

  return (
    <>
      <header>
        <h1>MoviesLand</h1>
        <div className="search">
          <input
            type="text"
            value={query}
            placeholder="Search for Movies, Series and Games..."
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearchClick()}
          />
          <button title="Search" onClick={handleSearchClick}></button>
        </div>
      </header>
      {movieRoute ? (
        <Movie movie={oneMovie} />
      ) : (
        <div className="movies">
          {moviesArr.length > 0 ? (
            moviesArr.map((movie, i) => (
              <MovieCard key={i} movie={movie} handleClick={handleClick} />
            ))
          ) : fetchErr ? (
            <div className="fetchErr">No Data Found!</div>
          ) : (
            <div className="loading">
              <img src={loading} alt="Loading" draggable="false" />
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Components

const MovieCard = ({ movie, handleClick }) => {
  return (
    <div
      className="movieCard"
      data-year={movie.Year}
      style={{
        backgroundImage:
          "url(" +
          (movie.Poster === "N/A"
            ? "https://via.placeholder.com/250x350?text=No+Poster"
            : movie.Poster) +
          ")"
      }}
      onClick={() => handleClick(movie.imdbID)}
    >
      <div className="info">
        <h4>{movie.Type}</h4>
        <h3>{movie.Title}</h3>
      </div>
    </div>
  )
}

const Movie = ({ movie }) => {
  const actors = movie.Actors.split(", ")
  const writers = movie.Writer.split(", ")
  const awards = movie.Awards.split(". ")
  return (
    <div className="moviePage">
      <div className="image">
        <div className="down">
          <h3>More Details</h3>
          <h4>
            <img src={actorsIMG} alt=" " width="20" height="20" />
            <span>Actors</span>
          </h4>
          <ul>
            {actors.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          <h4>
            <img src={writersIMG} alt=" " width="20" height="20" />
            <span>Writers</span>
          </h4>
          <ul>
            {writers.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
          <h4>
            <img src={awardsIMG} alt=" " width="20" height="20" />
            <span>Awards</span>
          </h4>
          <ul>
            {awards.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          <h4>
            <img src={ratingsIMG} alt=" " width="20" height="20" />
            <span>Ratings</span>
          </h4>
          <ul>
            {movie.Ratings.map((r, i) => (
              <li key={i}>
                {r.Source} : {r.Value}
              </li>
            ))}
          </ul>
        </div>
        <div className="rating">
          <img src={star} alt=" " width="20" height="20" />
          <strong>{movie.imdbRating}</strong>
        </div>
        <img
          src={
            movie.Poster === "N/A"
              ? "https://via.placeholder.com/250x350?text=No+Poster"
              : movie.Poster
          }
          alt={movie.Title}
        />
      </div>

      <div className="head">
        <h2>
          {movie.Title} <span>{"(" + movie.Year + ")"}</span>
        </h2>
        <div className="genre">
          <span>{movie.Type}</span> | <span>{movie.Genre}</span>
        </div>
        <ul className="more">
          <li>
            <img src={rated} alt=" " width="16" height="16" />
            <span>{movie.Rated}</span>
          </li>
          <li>
            <img src={released} alt=" " width="16" height="16" />
            <span>{movie.Released}</span>
          </li>
          <li>
            <img src={runtime} alt=" " width="16" height="16" />
            <span>{movie.Runtime}</span>
          </li>
        </ul>
        <div className="plot">{movie.Plot}</div>
        <hr />
        <ol>
          <li>
            <strong>Director:</strong> <span>{movie.Director}</span>
          </li>
          <li>
            <strong>Country:</strong> <span>{movie.Country}</span>
          </li>
          <li>
            <strong>Language:</strong> <span>{movie.Language}</span>
          </li>
          <li>
            <strong>Box Office:</strong> <span>{movie.BoxOffice}</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

export default App
