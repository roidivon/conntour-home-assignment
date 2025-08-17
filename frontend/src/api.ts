import Axios from 'axios';
import type { Search, SearchResult } from './types.ts';
import qs from 'qs';

const axios = Axios.create({
  baseURL: '/api',
});

export const getSearchHistory = async ({ pageParam }): Promise<SearchResult> => {
  const { data } = await axios(`/search?${qs.stringify(pageParam)}`);
  return data;
};

export const createSearch = async (query: string): Promise<Search> => {
  const { data } = await axios.post('/search', { query });
  return data;
};

export const deleteSearch = async (id: string): Promise<void> => {
  await axios.delete(`/search/${id}`);
};

export const getImages = async ({ queryKey }: any) => {
  try {
    const { data } = await axios(`/search-results/${queryKey[1]}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || error.message);
  }
};
