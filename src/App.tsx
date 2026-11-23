import { lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'

// Each page loads only when visited, which keeps the first load fast.
const Home = lazy(() => import('./pages/Home'))
const Discover = lazy(() => import('./pages/Discover'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Awakening = lazy(() => import('./pages/Awakening'))
const Results = lazy(() => import('./pages/Results'))
const Atelier = lazy(() => import('./pages/Atelier'))
const Grimoire = lazy(() => import('./pages/Grimoire'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

// HashRouter keeps routes after a "#", so refresh and static hosting work with no server setup.
export const AppRoutes = () => (
  <Routes>
    <Route element={<AppShell />}>
      <Route index element={<Home />} />
      <Route path="discover" element={<Discover />} />
      <Route path="quiz" element={<Quiz />} />
      <Route path="awakening" element={<Awakening />} />
      <Route path="results" element={<Results />} />
      <Route path="atelier" element={<Atelier />} />
      <Route path="grimoire" element={<Grimoire />} />
      <Route path="about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
