import './App.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/Routes/ProtectedRoute/ProtectedRoute';

// import Loading from './components/Loading/Loading';
// import FrameTemplate from './templates/FrameTemplate/FrameTemplate';
// import ProjectManagement from './pages/ProjectManagement/ProjectManagement';
// import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
// import CreateProject from './pages/CreateProject/CreateProject';
// import UserProfile from './pages/UserProfile/UserProfile';
// import UserManagement from './pages/Admin/UserManagement/UserManagement';
// import AccessTemplate from './templates/AccessTemplate/AccessTemplate';
// import SignIn from './pages/SignIn/SignIn';
// import SignUp from './pages/SignUp/SignUp';
// import PageNotFound from './components/PageNotFound/PageNotFound';

const Loading = lazy(() => import('./components/Loading/Loading'));
const FrameTemplate = lazy(() => import('./templates/FrameTemplate/FrameTemplate'));
const ProjectManagement = lazy(() => import('./pages/ProjectManagement/ProjectManagement'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const CreateProject = lazy(() => import('./pages/CreateProject/CreateProject'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement/UserManagement'));
const AccessTemplate = lazy(() => import('./templates/AccessTemplate/AccessTemplate'));
const SignIn = lazy(() => import('./pages/SignIn/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const PageNotFound = lazy(() => import('./components/PageNotFound/PageNotFound'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<PageNotFound />} />
          <Route path='/' element={<FrameTemplate />} >
            <Route index element={
              <ProtectedRoute>
                <ProjectManagement />
              </ProtectedRoute>
            } />
            <Route path='project-management' element={
              <ProtectedRoute>
                <ProjectManagement />
              </ProtectedRoute>
            } />
            <Route path='project-detail/:id' element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } />
            <Route path='create-project' element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            } />
            <Route path='profile/:id' element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path='admin' element={<UserManagement />} />
          </Route>
          <Route path='/user' element={<AccessTemplate />} >
            <Route path='sign-in' element={<SignIn />} />
            <Route path='sign-up' element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;