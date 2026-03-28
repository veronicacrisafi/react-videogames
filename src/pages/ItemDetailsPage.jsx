import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCategoryBadgeStyle, getConsoleBadgeStyle } from '../lib/badgeColors'
import { fetchItemById } from '../services/itemsApi'

function ItemDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadItem = async () => {
            if (!id) {
                navigate('/404', { replace: true })
                return
            }

            try {
                setLoading(true)
                setError('')
                const result = await fetchItemById(id)

                if (!result?.id) {
                    navigate('/404', { replace: true })
                    return
                }

                setItem(result)
            } catch {
                setError('Elemento non disponibile o non raggiungibile dal backend.')
            } finally {
                setLoading(false)
            }
        }

        loadItem()
    }, [id, navigate])

    if (loading) {
        return (
            <div className="alert alert-info" role="status">
                Caricamento dettaglio...
            </div>
        )
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        )
    }

    if (!item) {
        return null
    }

    return (
        <article>
            <Link to="/" className="btn btn-link px-0 mb-3">
                Torna al catalogo
            </Link>

            <div className="row g-4 align-items-start">
                <div className="col-12 col-lg-5">
                    {item.imageUrl ?
                        <img src={item.imageUrl} alt={item.title} className="img-fluid rounded-4 shadow-sm" />
                        :
                        <div className="placeholder-cover detail">Immagine non disponibile</div>}
                </div>

                <div className="col-12 col-lg-7">
                    <h1 className="display-6 mb-2">{item.title}</h1>

                    <p className="text-secondary mb-4">{item.description}</p>

                    <h2 className="h5 mb-2">Info collegate</h2>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {item.categories.length > 0 ?
                            item.categories.map((category) => (
                                <span
                                    key={category.name}
                                    className="badge border"
                                    style={getCategoryBadgeStyle(category.color)}
                                >
                                    {category.name}
                                </span>
                            ))
                            :
                            <span className="text-secondary">Nessuna categoria disponibile.</span>}
                    </div>

                    <div className="mb-4">
                        <p className="fw-semibold mb-2">Console</p>
                        <div className="d-flex flex-wrap gap-2">
                            {item.consoles?.length ?
                                item.consoles.map((consoleName) => (
                                    <span
                                        key={consoleName}
                                        className="badge border"
                                        style={getConsoleBadgeStyle(consoleName)}
                                    >
                                        {consoleName}
                                    </span>
                                ))
                                :
                                <span className="text-secondary">Nessuna console disponibile.</span>}
                        </div>
                    </div>

                    <dl className="row mb-0">
                        <dt className="col-sm-4">Sviluppatore</dt>
                        <dd className="col-sm-8">{item.developerName || 'n/d'}</dd>

                        <dt className="col-sm-4">Data uscita</dt>
                        <dd className="col-sm-8">{item.releaseDate || 'n/d'}</dd>
                    </dl>
                </div>
            </div>
        </article>
    )
}

export default ItemDetailsPage
