import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CampaignsList from './pages/campaigns/CampaignsList';
import CampaignDetails from './pages/campaigns/CampaignDetails';
import CampaignForm from './pages/campaigns/CampaignForm';
import CategoriesList from './pages/categories/CategoriesList';
import CategoryDetails from './pages/categories/CategoryDetails';
import CategoryForm from './pages/categories/CategoryForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns">
            <Route index element={<CampaignsList />} />
            <Route path="new" element={<CampaignForm />} />
            <Route path=":id" element={<CampaignDetails />} />
            <Route path=":id/edit" element={<CampaignForm />} />
          </Route>
          <Route path="categories">
            <Route index element={<CategoriesList />} />
            <Route path="new" element={<CategoryForm />} />
            <Route path=":id" element={<CategoryDetails />} />
            <Route path=":id/edit" element={<CategoryForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
