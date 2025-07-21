import { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PWAUpdateNotification from '@/components/common/PWAUpdateNotification';
import { routes } from '@/router';
import { AnimationProvider } from './components/animations/AnimationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Router component using the new useRoutes hook for better performance
function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <Router>
          <LanguageProvider>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <AppRoutes />
              </Suspense>
            </Layout>
            <PWAUpdateNotification />
          </LanguageProvider>
        </Router>
      </AnimationProvider>
    </ThemeProvider>
  );
}

export default App;
