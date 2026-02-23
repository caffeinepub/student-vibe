import { useState, useEffect } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadNotePage from './pages/UploadNotePage';
import BrowseNotesPage from './pages/BrowseNotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import QuizPage from './pages/QuizPage';
import VivaPage from './pages/VivaPage';
import StudyGroupsPage from './pages/StudyGroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupModal from './components/ProfileSetupModal';
import SplashScreen from './components/SplashScreen';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: UploadNotePage,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: BrowseNotesPage,
});

const noteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes/$noteId',
  component: NoteDetailPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz/$noteId',
  component: QuizPage,
});

const vivaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/viva/$subject',
  component: VivaPage,
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/groups',
  component: StudyGroupsPage,
});

const groupDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/groups/$groupId',
  component: GroupDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  uploadRoute,
  browseRoute,
  noteDetailRoute,
  quizRoute,
  vivaRoute,
  groupsRoute,
  groupDetailRoute,
  profileRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
