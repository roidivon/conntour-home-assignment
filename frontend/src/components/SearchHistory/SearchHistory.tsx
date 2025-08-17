import { Input, Skeleton } from 'antd';
import times from 'lodash/times';
import { useSearchHistory } from './useSearchHistory.ts';
import { ErrorMessage } from '../common/ErrorMessage.tsx';
import { WithSkeleton } from '../common/WithSkeleton.tsx';
import { SearchList } from './SearchList.tsx';

export const SearchHistory = () => {
  const { query, setQuery, items, isLoading, error, handleSearch, rootRef, ...rest } =
    useSearchHistory();
  return (
    <div className='p-2 w-[350px] bg-slate-100'>
      <Input.Search
        className='mb-2'
        placeholder='Search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
      />
      {error && <ErrorMessage message={error.message} />}
      {items && items.length === 0 && (
        <div className='text-gray-500 text-center mt-8'>No searches</div>
      )}
      <WithSkeleton isLoading={isLoading} skeleton={<ListSkeleton />}>
        <SearchList {...rest} items={items!} rootRef={rootRef} />
      </WithSkeleton>
    </div>
  );
};

const ListSkeleton = () => (
  <>
    {times(3).map((i: number) => (
      <Skeleton.Input key={i} className='!w-full not-last:mb-2' active />
    ))}
  </>
);
