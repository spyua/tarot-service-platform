import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load pages for optimal code splitting
const Home = lazy(() => import('@/pages/Home/Home'));
const FreeReading = lazy(() => import('@/pages/FreeReading/FreeReading'));
const DailyCard = lazy(() => import('@/pages/DailyCard/DailyCard'));
const History = lazy(() => import('@/pages/History/History'));
const Settings = lazy(() => import('@/pages/Settings/Settings'));
const AnimationTest = lazy(() => import('@/pages/AnimationTestPage'));
const TarotCardTest = lazy(() => import('@/pages/TarotCardTestPage'));

// Define route configuration
export const routes: RouteObject[] = [
  {
    path: '/',
    element: React.createElement(Home),
    index: true,
  },
  {
    path: '/free-reading',
    element: React.createElement(FreeReading),
  },
  {
    path: '/daily-card',
    element: React.createElement(DailyCard),
  },
  {
    path: '/history',
    element: React.createElement(History),
  },
  {
    path: '/settings',
    element: React.createElement(Settings),
  },
  {
    path: '/animation-test',
    element: React.createElement(AnimationTest),
  },
  {
    path: '/tarot-card-test',
    element: React.createElement(TarotCardTest),
  },
  {
    path: '*',
    element: React.createElement('div', {}, '頁面未找到 / Page Not Found'),
  },
];

// Route paths for type-safe navigation
export const ROUTES = {
  HOME: '/',
  FREE_READING: '/free-reading',
  DAILY_CARD: '/daily-card',
  HISTORY: '/history',
  SETTINGS: '/settings',
  ANIMATION_TEST: '/animation-test',
  TAROT_CARD_TEST: '/tarot-card-test',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
