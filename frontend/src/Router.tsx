import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Gallery } from './components/Gallery/Gallery.tsx';
import { NoSearchSelectedView } from './components/common/NoSearchSelectedView.tsx';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' index element={<NoSearchSelectedView />} />
          <Route path=':searchId' element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
