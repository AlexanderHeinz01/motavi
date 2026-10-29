import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './app/AppShell'
import RequireAuth from './app/auth/RequireAuth'
import SiteLayout from './website/layout/SiteLayout'
import NotFoundPage from './website/pages/NotFoundPage'
import { siteRoutes } from './website/routes'

// The analysis app is loaded on demand so the website stays small.
const LoginPage = lazy(() => import('./app/pages/LoginPage'))
const UploadPage = lazy(() => import('./app/pages/UploadPage'))
const AnalyzingPage = lazy(() => import('./app/pages/AnalyzingPage'))
const DashboardPage = lazy(() => import('./app/pages/DashboardPage'))
// Previous marketing page, kept for reference until the new start page is done.
const LegacyMarketingPage = lazy(() => import('./marketing/MarketingPage'))

/** All routes; shared by the browser router (main.tsx) and the prerender step (entry-server.tsx). */
export function AppRoutes() {
  return (
    <Routes>
      {/* Website (light, prerendered) */}
      <Route element={<SiteLayout />}>
        {siteRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Analysis app (dark, client only, noindex) */}
      <Route element={<AppShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<RequireAuth><UploadPage /></RequireAuth>} />
        <Route path="/app/analyzing/:jobId" element={<RequireAuth><AnalyzingPage /></RequireAuth>} />
        <Route path="/app/dashboard/:jobId" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/_alt-startseite" element={<LegacyMarketingPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
