import { API_BASE_URL } from "./config";

//questo file lo usiamo per convertire i dati backend in un oggetto fontend più pulito
//funzione base del file che prende tutti gli argomenti e li mette in un array
//li passa uno ad uno e se vanno bene ci ritorna il valore, altrimenti null
//invece di usare molti if andremo ad usare solo questa funzione
const firstValue = (...candidates) => {
  for (const value of candidates) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return null;
};

//questa funzione normalizza il genere
//se stringa la trasforma in oggetto e il color rimane null (il frontend vuole sempre lo stesso formato)
const normalizeCategoryName = (category) => {
  if (typeof category === "string") {
    return {
      name: category,
      color: null,
    };
  }
  //se è un oggetto, verifica che sia valido
  if (!category || typeof category !== "object") {
    return null;
  }
  //cerca il nome del genere con la funzione firstValue
  //prova più chiavi possibili (la mia del db e altre papabili)
  const name = firstValue(
    category.genere_videogame,
    category.name,
    category.label,
    category.title,
  );
  //se non trova qualche chiave darà null nell'oggetto
  if (!name) {
    return null;
  }

  //se le trova restituisce l'oggetto con il genere e il colore
  return {
    name,
    color: firstValue(category.colore, category.color, category.hex, null),
  };
};

//questa funzione normalizza la consosole
//se si tratta di una stringa la restituisce così com'è
const normalizeConsoleName = (consoleItem) => {
  if (typeof consoleItem === "string") {
    return consoleItem;
  }
  //se fosse un oggetto
  //controlla che sia valido altrimenti ritornerà null
  if (!consoleItem || typeof consoleItem !== "object") {
    return null;
  }
  //se invece si trattasse di un oggetto
  //prova le varie chiavi possibili (tra cui la mia del DB)
  //ci restituirà sempre una stringa, perché qui non abbiamo un colore come per i generi
  return firstValue(
    consoleItem.nome_console,
    consoleItem.name,
    consoleItem.label,
  );
};

//questa funzione normalizza l'intera collezione dei generi di un videogame
//siccome nel backend potrebbe chiamarsi in diversi modi
//creata una lista di "candidati"
const normalizeCategories = (rawItem) => {
  const candidates = [
    rawItem.categories,
    rawItem.genres,
    rawItem.tags,
    rawItem.category,
  ];

  //qui cerca il primo candidato che sia effettivamente un array
  //se lo trova lo usa
  const source = candidates.find((value) => Array.isArray(value));
  //se non trovasse l'array ma trova il singolo genere
  //lo normalizza con la funzione precedente e lo mette nell'array
  //se non trovasse nulla ci darebbe un array vuoto
  if (!source) {
    const single = normalizeCategoryName(rawItem.category);
    return single ? [single] : [];
  }
  //trovato l'array applica la funzione a tutti gli elementi
  //elimina eventuali null, false, undefind ecc... filtrandoli e dando in risposta un valore booleano
  return source.map(normalizeCategoryName).filter(Boolean);
};

//funzione per restituirci il titolo di un elemento
//anche in questo caso uso la funzione base fisrtValue
//provo più campi (tra cui il nostro reale del DB)
export const getItemTitle = (item) =>
  firstValue(
    item?.titolo_videogame,
    item?.title,
    item?.name,
    item?.label,
    "Elemento senza titolo",
  );

//questa funzione normalizza la lista delle console per il videogame
//cerca una chiave valida e che sia davvero un array (la mia è console)
//se lo trova ci restituisce il secondo pezzo dopo il controllo array
const normalizeConsoles = (rawItem) => {
  const source =
    (Array.isArray(rawItem.consoles) && rawItem.consoles) ||
    (Array.isArray(rawItem.platforms) && rawItem.platforms) ||
    [];
  //se trovasse l'array, passa ogni elemento e gli applica la funzione
  //se non trovasse nulla ci darebbe un array vuoto
  //elimina eventuali null, false, undefind ecc... filtrandoli e dando in risposta un valore booleano
  return source.map(normalizeConsoleName).filter(Boolean);
};

//questa funzione prende il nome dello sviluppatore
//prova i vari candidati (tra cui il mio del DB che potrebbe essere annidato)
//come risultato ci darà una stringa usando sempre la funzione base firstValue
const normalizeDeveloper = (rawItem) => {
  return firstValue(
    rawItem?.developer?.nome_sviluppatore,
    rawItem?.developer?.name,
    rawItem?.nome_sviluppatore,
    rawItem?.developerName,
  );
};

//per avere il formato delle immagini sempre valide tra backend e frontend
const isAbsoluteUrl = (value) => /^(https?:)?\/\//i.test(value);

const isInlineImageUrl = (value) => /^(data|blob):/i.test(value);

const resolveImageUrl = (value) => {
  if (!value) {
    return null;
  }

  const clean = String(value).trim();
  if (clean.length === 0) {
    return null;
  }

  if (isAbsoluteUrl(clean) || isInlineImageUrl(clean)) {
    return clean;
  }

  // Laravel often stores just "videogames/file.png" on disk public.
  if (clean.startsWith("public/")) {
    const publicPath = clean.replace(/^public\//, "");
    return `${API_BASE_URL}/storage/${publicPath}`;
  }

  if (clean.startsWith("storage/")) {
    return `${API_BASE_URL}/${clean}`;
  }

  if (clean.startsWith("/videogames/")) {
    return `${API_BASE_URL}/storage${clean}`;
  }

  if (!clean.startsWith("/")) {
    return `${API_BASE_URL}/storage/${clean}`;
  }

  const normalizedPath = clean.startsWith("/") ? clean : `/${clean}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

//questa è la funzione principale
//trasforma un singolo record presente nel backend in un oggetto frontend standard
export const normalizeItem = (rawItem) => {
  //creo una costante che sarà uguale al parametro dell'arrow function
  //se c'è lo usi altrimenti se fosse null o undefind {}
  const safeRaw = rawItem ?? {};
  //qui costruisce e restituisce un nuovo oggetto con i vari campi
  return {
    id: firstValue(safeRaw.id, safeRaw._id, safeRaw.slug),
    title: getItemTitle(safeRaw),
    description: firstValue(
      safeRaw.descrizione_videogame,
      safeRaw.description,
      safeRaw.summary,
      safeRaw.overview,
      "Nessuna descrizione disponibile.",
    ),
    imageUrl: resolveImageUrl(
      firstValue(
        safeRaw.immagine_videogame,
        safeRaw.image,
        safeRaw.imageUrl,
        safeRaw.image_url,
        safeRaw.cover,
        safeRaw.copertina_videogame,
        safeRaw.poster,
        safeRaw.thumbnail,
        safeRaw.thumb,
        safeRaw.path_immagine,
        safeRaw.url,
      ),
    ),
    categories: normalizeCategories(safeRaw),
    consoles: normalizeConsoles(safeRaw),
    developerName: normalizeDeveloper(safeRaw),
    releaseDate: firstValue(
      safeRaw.anno_videogame,
      safeRaw.releaseDate,
      safeRaw.releasedAt,
      safeRaw.release_year,
      safeRaw.year,
    ),
  };
};

//questa funzione gestisce le intere liste
export const normalizeItems = (payload) => {
  //variabile vuota che viene popolata man mano
  let source = [];
  //controlla se il parametro è un array e se c'è tra i vari candidati (il mio è .data)
  if (Array.isArray(payload)) {
    source = payload;
  } else if (Array.isArray(payload?.data)) {
    source = payload.data;
  } else if (Array.isArray(payload?.results)) {
    source = payload.results;
  } else if (Array.isArray(payload?.items)) {
    source = payload.items;
  }

  //ogni singolo elemento viene trasformato
  //filtro gli elementi,tenendo quelli con id valido se non ce ne fossero darebbe null
  return source.map(normalizeItem).filter((item) => item.id !== null);
};
