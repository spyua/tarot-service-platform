import { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { routes } from '@/router';

// Router component using the new useRoutes hook for better performance
function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
