import { getData, postData } from './axios';

export const getNowPlayingMovies = async () => {
  return await getData("/movies/moviesList");
} 

export const getPopularMovies = async () => {
  return await getData("/movies/popularMovies");
}

export const getAllPopularMovies = async () => {
  return await getData("/movies/allPopularMovies");
}