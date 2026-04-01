import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import LostAndFound from './pages/LostAndFound';

import AdminLostAndFound from './pages/AdminLostAndFound';
import AdminManagePosts from './pages/AdminManagePosts';

import Status from './pages/Status';

import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import GameContainer from './components/game/GameContainer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="register" element={<Registration />} />
          <Route path="status" element={<Status />} />
          <Route path="lost-and-found" element={<LostAndFound />} />
          <Route
            path="admin/lost-and-found"
            element={
              <ProtectedAdminRoute>
                <AdminLostAndFound />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="admin/manage-posts"
            element={
              <ProtectedAdminRoute>
                <AdminManagePosts />
              </ProtectedAdminRoute>
            }
          />
          <Route path="game" element={<GameContainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
