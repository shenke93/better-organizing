import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import AddItemPage from './pages/AddItemPage';
import EditItemPage from './pages/EditItemPage';
import LocationsPage from './pages/LocationsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/add" element={<AddItemPage />} />
          <Route path="/edit/:id" element={<EditItemPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
