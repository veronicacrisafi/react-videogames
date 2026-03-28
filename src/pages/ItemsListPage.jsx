import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategoryBadgeStyle, getConsoleBadgeStyle } from '../lib/badgeColors'
import { fetchItems } from '../services/itemsApi'

function ItemsListPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadItems = async () => {
            try {
                setLoading(true)
                setError('')
                const result = await fetchItems()
                setItems(result)
            } catch {
                setError(
                    'Impossibile caricare il catalogo. Controlla API, endpoint o variabili VITE_API_*.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadItems()
    }, [])

    return (
        <section>
            <div className="hero-panel mb-4">
                <p className="text-uppercase small fw-semibold mb-2">Guest Area</p>
                <h1 className="h3 mb-2">Esplora il catalogo</h1>
                <p className="mb-0 text-secondary">
                    Visualizza la lista degli elementi disponibili e apri il dettaglio con
                    categorie e informazioni collegate.
                </p>
            </div>

            {loading && (
                <div className="alert alert-info" role="status">
                    Caricamento in corso...
                </div>
            )}

            {error && !loading && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className="alert alert-warning" role="alert">
                    Nessun elemento trovato.
                </div>
            )}

            <div className="row g-4">
                {items.map((item) => (
                    <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                        <article className="card h-100 shadow-sm border-0 overflow-hidden">
                            {item.imageUrl ?
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="card-img-top item-cover"
                                />
                                :
                                <div className="placeholder-cover">Immagine non disponibile</div>}

                            <div className="card-body d-flex flex-column">
                                <h2 className="h5 card-title mb-2">{item.title}</h2>
                                <p className="card-text text-secondary item-description flex-grow-1">
                                    {item.description}
                                </p>

                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    {item.categories.slice(0, 10).map((category) => (
                                        <span
                                            key={`${item.id}-${category.name}`}
                                            className="badge border"
                                            style={getCategoryBadgeStyle(category.color)}
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>

                                <p className="small mb-1">
                                    <span className="fw-semibold">Sviluppatore:</span>{' '}
                                    {item.developerName || 'n/d'}
                                </p>

                                <p className="small text-secondary mb-3">
                                    <span className="fw-semibold text-dark">Console:</span>{' '}
                                    {item.consoles?.length ? (
                                        item.consoles.slice(0, 10).map((consoleName) => (
                                            <span
                                                key={`${item.id}-${consoleName}`}
                                                className="badge border ms-1 mb-2"
                                                style={getConsoleBadgeStyle(consoleName)}
                                            >
                                                {consoleName}
                                            </span>
                                        ))
                                    ) : 'n/d'}
                                </p>

                                <Link className="btn btn-outline-primary mt-auto" to={`/items/${item.id}`}>
                                    Vai al dettaglio
                                </Link>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ItemsListPage
