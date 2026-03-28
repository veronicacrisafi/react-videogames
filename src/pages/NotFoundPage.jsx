import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="text-center py-5">
      <h1 className="display-4 fw-bold mb-3">404</h1>
      <p className="text-secondary mb-4">Pagina non trovata.</p>
      <Link to="/" className="btn btn-primary">
        Torna al catalogo
      </Link>
    </section>
  )
}

export default NotFoundPage
