//useEffect gestire effetti collaterali dopo il render , useState per memorizzare e aggiornare lo stato del componente
import { useEffect, useState } from 'react'
//Link per la navigazione, useNavigate per i redirect, useParams per leggere l'id preso dall'URL
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCategoryBadgeStyle, getConsoleBadgeStyle } from '../lib/badgeColors'//style dei badge 
import { fetchItemById } from '../services/itemsApi' //funzione che chiama il back e ci dà il singolo videogame

//funzione per il jsx
function ItemDetailsPage() {
    const { id } = useParams()//legge i parametri dinamici della rotta dedicata in App.jsx
    const navigate = useNavigate()//restituisce una funzione che permette di cambiare rotta (usata per /404)

    //costante che contiene il videogame caricato, il valore iniziale è null perché il record non è ancora arrivato
    const [item, setItem] = useState(null)
    //costante che indica il caricamento del dettaglio 
    const [loading, setLoading] = useState(true)
    //costante per l'eventuale messaggio di errore
    const [error, setError] = useState('')

    //qui parte effettivamente la chiamata
    //si usa useEffect per non far partire in continuazione la chiamata al backend ma solo all'apertura della pagina 
    useEffect(() => {
        //funzione asincrona
        const loadItem = async () => {
            //se non trovasse l'id porta alla rotta di errore /404
            if (!id) {
                navigate('/404', { replace: true })
                return
            }
            //prova a fare il caricamento
            try {
                setLoading(true)//caricamento in corso
                setError('')//pulisce eventuali errori precedenti
                const result = await fetchItemById(id)//parte la chiamata API
                //se il risultato non venisse trovato, viene dirottato alla rotta di errore /404
                if (!result?.id) {
                    navigate('/404', { replace: true })
                    return
                }
                //se invece lo trovasse darebbe il risultato
                setItem(result)
            }
            //se fallisse il caricamento
            catch {
                setError('Elemento non disponibile o non raggiungibile dal backend.')
            }
            //esegue sempre,sia che il caricamento vada a buon fine o se fallisse per spegnere il caricamento
            finally {
                setLoading(false)
            }
        }

        loadItem()//per rieseguire il load e le dipendenze, solo ad ogni passaggio di dettaglio 
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
