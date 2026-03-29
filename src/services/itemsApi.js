import axios from "axios";
import { API_BASE_URL, API_PREFIX, API_RESOURCE } from "../lib/config"; //per definire come costruire URL e API
import { normalizeItem, normalizeItems } from "../lib/normalize"; //per la conversione di ciò che arriva dal backend in un formato coerente per la UI

//questo è il punto in cui il frontend parla con il backend
//chiamata axios asincrone verso l'API
//impostato su create invece di get per dare in modo automatico a tutte le chiamate la stessa impostazione
const api = axios.create({
  //base comune per tutte le chiamate
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  //tempo di attesa max 10 secondi per evitare attese lunghe se ci fossero problemi
  timeout: 10000,
});

//arrow function più compatta
//serve per prendere il responso (contenuto) della risposta
//se response.data c'è mi restituisce l'oggetto , altrimenti restituirà response
const getPayload = (response) => response?.data ?? response;

//questa funzione serve per le risposte che hanno una lista di oggetti
//se c'è l'array payload.data (data è la mia chiave che contiene ciò che mi serve) me lo dai come return
// se non ci fosse l'array, mi restituisci un array vuoto
const extractCollectionPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

//questa funzione è simile alla precedenza ma serve per il singolo oggetto e non la lista di oggetti
//serve per distinguere ciò che ci serve nella index e cosa nella show
//in base a dove lo trova lo restituisce
const extractItemPayload = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.item && !Array.isArray(payload.item)) {
    return payload.item;
  }

  return payload;
};

//questa funzione è una funzione asincrona (serve per gestire le richieste che richiedono tempo)
//si usa await per attendere il responso senza bloccare nulla
export const fetchItems = async () => {
  //qui viene fatta la richiesta get alla risorsa
  const response = await api.get(`/${API_RESOURCE}`);
  //qui tramite la funzione getPayload viene preso il responso della chiamata
  const payload = getPayload(response);
  //qui come return usiamo la funzione importata dal file normalize.js per convertire in formato backend con quello frontend
  //con la funzione extractCollectionPayload viene estratto l'array di tutti i videogames
  return normalizeItems(extractCollectionPayload(payload));
};

//questa funzione è una funzione asincrona (serve per gestire le richieste che richiedono tempo)
//si usa await per attendere il responso senza bloccare nulla
export const fetchItemById = async (id) => {
  //qui viene fatta la richiesta get alla risorsa, ma questa volta per il singolo videogame
  const response = await api.get(`/${API_RESOURCE}/${id}`);
  //qui tramite la funzione getPayload viene preso il responso della chiamata
  const payload = getPayload(response);
  //con la funzione extractItemPayload viene estratto l'array del singolo videogame
  return normalizeItem(extractItemPayload(payload));
};
