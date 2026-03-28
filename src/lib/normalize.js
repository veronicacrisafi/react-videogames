import { API_BASE_URL } from "./config";

const firstValue = (...candidates) => {
  for (const value of candidates) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return null;
};

const normalizeCategoryName = (category) => {
  if (typeof category === "string") {
    return {
      name: category,
      color: null,
    };
  }

  if (!category || typeof category !== "object") {
    return null;
  }

  const name = firstValue(
    category.genere_videogame,
    category.name,
    category.label,
    category.title,
  );

  if (!name) {
    return null;
  }

  return {
    name,
    color: firstValue(category.colore, category.color, category.hex, null),
  };
};

const normalizeConsoleName = (consoleItem) => {
  if (typeof consoleItem === "string") {
    return consoleItem;
  }

  if (!consoleItem || typeof consoleItem !== "object") {
    return null;
  }

  return firstValue(
    consoleItem.nome_console,
    consoleItem.name,
    consoleItem.label,
  );
};

const normalizeCategories = (rawItem) => {
  const candidates = [
    rawItem.categories,
    rawItem.genres,
    rawItem.tags,
    rawItem.category,
  ];

  const source = candidates.find((value) => Array.isArray(value));
  if (!source) {
    const single = normalizeCategoryName(rawItem.category);
    return single ? [single] : [];
  }

  return source.map(normalizeCategoryName).filter(Boolean);
};

export const getItemTitle = (item) =>
  firstValue(
    item?.titolo_videogame,
    item?.title,
    item?.name,
    item?.label,
    "Elemento senza titolo",
  );

const normalizeConsoles = (rawItem) => {
  const source =
    (Array.isArray(rawItem.consoles) && rawItem.consoles) ||
    (Array.isArray(rawItem.platforms) && rawItem.platforms) ||
    [];

  return source.map(normalizeConsoleName).filter(Boolean);
};

const normalizeDeveloper = (rawItem) => {
  return firstValue(
    rawItem?.developer?.nome_sviluppatore,
    rawItem?.developer?.name,
    rawItem?.nome_sviluppatore,
    rawItem?.developerName,
  );
};

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

export const normalizeItem = (rawItem) => {
  const safeRaw = rawItem ?? {};

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
    rating: firstValue(safeRaw.rating, safeRaw.score, safeRaw.voteAverage),
    raw: safeRaw,
  };
};

export const normalizeItems = (payload) => {
  let source = [];

  if (Array.isArray(payload)) {
    source = payload;
  } else if (Array.isArray(payload?.data)) {
    source = payload.data;
  } else if (Array.isArray(payload?.results)) {
    source = payload.results;
  } else if (Array.isArray(payload?.items)) {
    source = payload.items;
  }

  return source.map(normalizeItem).filter((item) => item.id !== null);
};
