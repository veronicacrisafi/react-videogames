//useEffect gestire effetti collaterali dopo il render , useState per memorizzare e aggiornare lo stato del componente
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' //per la navigazione
import { getCategoryBadgeStyle, getConsoleBadgeStyle } from '../lib/badgeColors' //per lo style badge generi(ugale al backend)
import { fetchItems } from '../services/itemsApi' //funzione che chiama il back e ci dà la lista dei videogames

//funzione per il jsx
function ItemsListPage() {
    //costante che contiene la lista dei videogames settata su un array vuoto(che dovrà essere popolato)
    const [items, setItems] = useState([])
    //costante che indica se la pagina sta aspettando ancora la risposta dal back, settata su true
    const [loading, setLoading] = useState(true)
    //costante per il messaggio eventuale di errore
    const [error, setError] = useState('')

    //qui parte effettivamente la chiamata
    //si usa useEffect per non far partire in continuazione la chiamata al backend ma solo all'apertura della pagina 
    useEffect(() => {
        //funzione asincrona
        const loadItems = async () => {
            //prova il caricamento in sicurezza
            try {
                setLoading(true)//dice alla UI che il caricamento è in corso
                setError('')//pulisce eventuali errori precedenti
                const result = await fetchItems()//parte la chiamata API
                setItems(result)//quando arriva il risultato viene salvato in setItems
            }
            //se fallisse il caricamento
            catch {
                //per eventuali errori tra front e back, non si popola la lista ma esce il messaggio di errore
                setError(
                    'Impossibile caricare il catalogo. Controlla API, endpoint o variabili VITE_API_*.'
                )
            }
            //esegue sempre,sia che il caricamento vada a buon fine o se fallisse per spegnere il caricamento
            finally {
                setLoading(false)//deve sempre essere eseguito per spegnere lo stato di caricamento
            }
        }

        loadItems()//per il load una sola volta
    }, [])

    //dopo tutta la logica qui abbiamo la reale interfaccia
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
                        <article className="card item-card h-100 shadow-sm border-0 overflow-hidden">
                            {item.imageUrl ?
                                <div className="item-cover-wrap">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="item-cover"
                                    />
                                </div>
                                :
                                <div className="placeholder-cover list">Immagine non disponibile</div>}

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

                                <Link className="btn btn-outline-primary w-100 mt-auto" to={`/items/${item.id}`}>
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
