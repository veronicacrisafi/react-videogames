const isHexColor = (value) => /^#([\da-f]{3}|[\da-f]{6})$/i.test(value);

const normalizeHex = (hex) => {
  const clean = hex.trim();
  if (!isHexColor(clean)) {
    return null;
  }

  if (clean.length === 4) {
    const [, r, g, b] = clean;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return clean;
};

const getRgbFromHex = (hex) => {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
};

const getReadableText = (rgb) => {
  if (!rgb) {
    return "#1f2937";
  }

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.65 ? "#111827" : "#ffffff";
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

export const getCategoryBadgeStyle = (hexColor) => {
  const rgb = getRgbFromHex(hexColor);
  if (!rgb) {
    return {
      borderWidth: "1.5px",
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
    };
  }

  const normalized = normalizeHex(hexColor);
  return {
    backgroundColor: normalized,
    borderColor: normalized,
    color: getReadableText(rgb),
    borderWidth: "1.5px",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.14)",
  };
};

export const getConsoleBadgeStyle = (consoleName) => {
  const safeName = consoleName?.trim() || "console";
  const hue = hashString(safeName) % 360;

  return {
    backgroundColor: `hsl(${hue} 75% 92%)`,
    borderColor: `hsl(${hue} 45% 70%)`,
    color: `hsl(${hue} 55% 22%)`,
    borderWidth: "1.5px",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
  };
};
