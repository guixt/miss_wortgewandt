import { Routes, Route } from 'react-router-dom';
import Home from './routes/home';
import Modules from './routes/modules';
import ModuleDetail from './routes/modules.$id';
import Layout from './root';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="modules" element={<Modules />} />
      <Route path="modules/:id" element={<ModuleDetail />} />
    </Route>
  </Routes>
);

export default App;
