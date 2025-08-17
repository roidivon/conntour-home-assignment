import { SearchHistory } from './SearchHistory/SearchHistory.tsx';
import { Outlet } from 'react-router-dom';

export const Layout = () => (
  <div className='flex w-full h-screen'>
    <SearchHistory />
    <div className='flex-1'>
      <Outlet />
    </div>
  </div>
);
