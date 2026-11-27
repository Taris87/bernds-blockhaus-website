import { createBrowserRouter } from 'react-router';
import { SiteLayout } from '../components/layout/SiteLayout';
import { HomePage } from '../pages/HomePage';
import { GastronomyPage } from '../pages/GastronomyPage';
import { ApartmentsPage } from '../pages/ApartmentsPage';
import { GalleryPage } from '../pages/GalleryPage';
import { EichwieserhofPage } from '../pages/EichwieserhofPage';
import { ContactPage } from '../pages/ContactPage';
import { ImprintPage, PrivacyPage } from '../pages/LegalPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([{
  path: '/', element: <SiteLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'gaststaette', element: <GastronomyPage /> },
    { path: 'ferienwohnungen', element: <ApartmentsPage /> },
    { path: 'galerie', element: <GalleryPage /> },
    { path: 'eichwieserhof', element: <EichwieserhofPage /> },
    { path: 'kontakt', element: <ContactPage /> },
    { path: 'impressum', element: <ImprintPage /> },
    { path: 'datenschutz', element: <PrivacyPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
}], { basename: import.meta.env.BASE_URL });
