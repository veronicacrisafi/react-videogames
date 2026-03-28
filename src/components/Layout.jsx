import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="app-shell">
      <header className="border-bottom bg-white shadow-sm">
        <nav className="container py-3 d-flex align-items-center justify-content-between">
          <NavLink className="brand-link" to="/">
            GameVerse Guest
          </NavLink>
          <div className="d-flex align-items-center gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link px-0 ${isActive ? 'active fw-semibold' : ''}`
              }
            >
              Catalogo
            </NavLink>
            <span className="badge text-bg-secondary">Modalita guest</span>
          </div>
        </nav>
      </header>

      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
