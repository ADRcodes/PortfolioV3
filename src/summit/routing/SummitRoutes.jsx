import { Route, Routes } from 'react-router';
import SummitLayout from '../components/SummitLayout.jsx';
import Home from '../pages/Home.jsx';
import Sessions from '../pages/Sessions.jsx';
import SessionDetail from '../pages/SessionDetail.jsx';
import { Directory, Profile } from '../pages/Directory.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function SummitRoutes() {
  return <Routes><Route element={<SummitLayout />}>
    <Route index element={<Home />} />
    <Route path="sessions" element={<Sessions />} />
    <Route path="sessions/:slug" element={<SessionDetail />} />
    <Route path="speakers" element={<Directory type="speakers" />} />
    <Route path="speakers/:slug" element={<Profile type="speakers" />} />
    <Route path="companies" element={<Directory type="companies" />} />
    <Route path="companies/:slug" element={<Profile type="companies" />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes>;
}
