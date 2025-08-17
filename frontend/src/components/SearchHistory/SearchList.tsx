import { useSearchHistory } from './useSearchHistory.ts';
import { type CSSProperties } from 'react';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import type { Search } from '../../types.ts';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';
import { InfiniteLoader, List } from 'react-virtualized';
import { useDynamicHeight } from '../../hooks/useDynamicHeight.ts';

export const SearchList = ({
  items,
  activeSearchId,
  handleDeleteClick,
  rootRef,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Pick<
  ReturnType<typeof useSearchHistory>,
  | 'handleDeleteClick'
  | 'activeSearchId'
  | 'loadMoreRef'
  | 'rootRef'
  | 'hasNextPage'
  | 'fetchNextPage'
  | 'isFetchingNextPage'
> & { items: Search[] }) => {
  const { height } = useDynamicHeight(rootRef);
  const rowCount = items.length + (hasNextPage ? 1 : 0);
  const isRowLoaded = ({ index }) => {
    return !hasNextPage || index < items.length;
  };
  const loadMoreRows = async () => {
    debugger;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  return (
    <div ref={rootRef} style={{ height: 'calc(100vh - 60px)' }}>
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
        {({ onRowsRendered, registerChild }) => (
          <List
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            height={height - 30}
            rowHeight={42}
            rowCount={rowCount}
            width={335}
            rowRenderer={({ index, style }) => {
              if (!isRowLoaded({ index })) {
                return (
                  <div className='h-[42px] text-center w-full' style={style} key='loader'>
                    <LoadingOutlined spin className='text-xl' />
                  </div>
                );
              }
              const item = items[index];
              return (
                <SearchItem
                  style={style}
                  item={item}
                  key={item.id}
                  isActive={item.id === activeSearchId}
                  handleDeleteClick={handleDeleteClick}
                />
              );
            }}
          />
        )}
      </InfiniteLoader>
    </div>
  );
};

const SearchItem = ({
  item: { id, query },
  isActive,
  handleDeleteClick,
  style,
}: { item: Search; isActive: boolean; style: CSSProperties } & Pick<
  ReturnType<typeof useSearchHistory>,
  'handleDeleteClick'
>) => {
  return (
    <div
      style={style}
      className={classNames(
        'group flex items-center px-2 cursor-pointer hover:bg-slate-300 rounded-md transition-all duration-100 not-last:mb-1',
        {
          '!bg-blue-200': isActive,
        },
      )}
    >
      <Link to={{ pathname: `/${id}` }} className='flex-1 py-2 !text-inherit truncate'>
        <Typography.Text ellipsis={{ tooltip: query }}>{query}</Typography.Text>
      </Link>

      <DeleteOutlined
        onClick={() => handleDeleteClick(id)}
        className={classNames(
          'rounded-4xl p-2 h-fit hover:bg-slate-200 invisible group-hover:visible',
        )}
      />
    </div>
  );
};
