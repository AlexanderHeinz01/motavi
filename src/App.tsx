import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './website/layout/SiteLayout'
import NotFoundPage from './website/pages/NotFoundPage'
import { siteRoutes } from './website/routes'

/**
 * All routes of the website; shared by the browser router (main.tsx) and the
 * prerender step (entry-server.tsx).
 *
 * The browser analysis app (src/app, src/analysis) is not part of the build
 * since 31.10.2026: no customer self-service at launch (decision G2). Video-Check
 * customers upload through a personal link to the backend (repo motavi-backend).
 * The code stays in the repository.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {siteRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
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
