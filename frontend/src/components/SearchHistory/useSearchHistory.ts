import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import last from 'lodash/last';
import { App } from 'antd';
import type { Search, SearchResult } from '../../types.ts';
import { createSearch, deleteSearch, getSearchHistory } from '../../api.ts';

const PAGE_SIZE = 30;

const QUERY_KEY = ['searches'];
type QueryData = {
  pages: Array<SearchResult>;
  pageParams: { cursor: string; page_size: number };
};

const filterPageByIdFactory = (id: string) => (page: Search[]) =>
  page.filter((search) => search.id !== id);

export const useSearchHistory = () => {
  const {
    notification,
    modal: { confirm },
  } = App.useApp();
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const activeSearchId = pathname.slice(1);
  const client = useQueryClient();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const navigateToSearch = (id: string) => navigate(`/${id}`);
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: QUERY_KEY,
      queryFn: getSearchHistory,
      initialPageParam: { cursor: '', page_size: PAGE_SIZE },
      getNextPageParam: (_, allPages = []) => {
        const items = allPages.map(({ content }) => content).flat();
        if (last(allPages)?.has_next_page) {
          return {
            page_size: PAGE_SIZE,
            cursor: last(items)?.last_used || '',
          }
        }
        return null;
      },
    });
  const { mutate: addSearch } = useMutation<Search, void, string>({
    mutationFn: createSearch,
    onError: () => {
      notification.error({ message: 'Failed to add search' });
    },
    onSuccess: (search) => {
      client.setQueryData(QUERY_KEY, ({ pages, pageParams }: QueryData): QueryData => {
        const [firstPage, ...rest] = pages;
        const filterPage = filterPageByIdFactory(search.id);
        return {
          pageParams,
          pages: [
            {
              has_next_page: firstPage.has_next_page,
              content: [search].concat(filterPage(firstPage.content)),
            },
          ]
            .concat(
              rest.map(({ has_next_page, content }) => ({
                has_next_page,
                content: filterPage(content),
              })),
            )
            .filter(Boolean),
        };
      });
      rootRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setQuery('');
      navigateToSearch(search.id);
    },
  });
  const handleSearch = () => {
    if (!query) {
      notification.error({ message: 'Search query cannot be empty' });
    } else {
      addSearch(query);
    }
  };
  const { mutate: removeSearch } = useMutation({
    mutationFn: deleteSearch,
    onError: () => {
      notification.error({ message: 'Failed to delete search' });
    },
    onSuccess: (_, id) => {
      client.setQueryData(QUERY_KEY, ({ pages, pageParams }: QueryData): QueryData => {
        const filterPage = filterPageByIdFactory(id);
        return {
          pageParams,
          pages: pages.map(({ content, has_next_page }) => ({
            has_next_page,
            content: filterPage(content),
          })),
        };
      });
      const data = client.getQueryData<unknown, any, QueryData>(QUERY_KEY);
      if (id === activeSearchId) {
        navigateToSearch(data?.pages?.[0]?.content[0]?.id || '');
      }
    },
  });
  const handleDeleteClick = (id: string) =>
    confirm({
      title: 'Delete search?',
      content: 'Are you sure?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => removeSearch(id),
    });
  return {
    query,
    setQuery,
    items: data?.pages.map(({ content }) => content).flat(),
    isLoading,
    error,
    handleSearch,
    navigateToSearch,
    handleDeleteClick,
    activeSearchId,
    loadMoreRef,
    rootRef,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
