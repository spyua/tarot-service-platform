import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { ROUTES, RoutePath } from '@/router';

/**
 * Type-safe navigation hook that provides convenient navigation methods
 */
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to a specific route with type safety
  const navigateTo = useCallback(
    (path: RoutePath, options?: { replace?: boolean; state?: any }) => {
      navigate(path, options);
    },
    [navigate]
  );

  // Navigate back in history
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Navigate forward in history
  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  // Check if currently on a specific route
  const isCurrentRoute = useCallback(
    (path: RoutePath): boolean => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  // Get current route path
  const currentPath = location.pathname as RoutePath;

  // Convenient navigation methods for specific routes
  const goToHome = useCallback(() => navigateTo(ROUTES.HOME), [navigateTo]);
  const goToFreeReading = useCallback(
    () => navigateTo(ROUTES.FREE_READING),
    [navigateTo]
  );
  const goToDailyCard = useCallback(
    () => navigateTo(ROUTES.DAILY_CARD),
    [navigateTo]
  );
  const goToHistory = useCallback(
    () => navigateTo(ROUTES.HISTORY),
    [navigateTo]
  );
  const goToSettings = useCallback(
    () => navigateTo(ROUTES.SETTINGS),
    [navigateTo]
  );

  return {
    // Core navigation methods
    navigateTo,
    goBack,
    goForward,

    // Route checking
    isCurrentRoute,
    currentPath,

    // Convenient route navigation
    goToHome,
    goToFreeReading,
    goToDailyCard,
    goToHistory,
    goToSettings,

    // Route constants for reference
    ROUTES,
  };
}
