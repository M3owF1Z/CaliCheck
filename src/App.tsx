import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import ProfileListPage from './pages/ProfileListPage'
import ProfileViewPage from './pages/ProfileViewPage'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="app-header__brand">
            <span className="app-header__brand-icon">💪</span>
            Calisthenics Tracker
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<ProfileListPage />} />
          <Route path="/profile/:id" element={<ProfileViewPage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
