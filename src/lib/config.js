//per rimuovere lo slah finale da una stringa se ci fosse
const trimSlash = (value) => value.replace(/\/$/, "");

const getBaseUrl = () => {
  // import.meta.env legge VITE_API_BASE_URL
  //prende l’indirizzo del backend dalle variabili di ambiente .env (http://localhost:8000)
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv && fromEnv.trim().length > 0) {
    return trimSlash(fromEnv.trim());
  }
  //se non trovasse l'indirizzo del back come riserva userebbe il localhost:3000
  return "http://localhost:3000";
};

//funzione di controllo del prefisso API (/api)
const getApiPrefix = () => {
  const fromEnv = import.meta.env.VITE_API_PREFIX;
  if (!fromEnv) {
    return "";
  }

  //controllo di validazione
  const clean = fromEnv.trim();
  if (clean.length === 0 || clean === "/") {
    return "";
  }
  //serve per avere il prefisso sempre con /
  //controlla se la stringa inizia con / se sì va bene così altrimenti lo aggiunge
  return clean.startsWith("/") ? clean : `/${clean}`;
};

export const API_BASE_URL = getBaseUrl();
export const API_PREFIX = getApiPrefix();
export const API_RESOURCE =
  import.meta.env.VITE_API_RESOURCE?.trim() || "videogames";
