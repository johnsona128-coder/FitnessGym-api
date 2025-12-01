function toCamel(str) {
  return str.replace(/_([a-z])/g, (m, c) => c.toUpperCase());
}

function normalizeKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [toCamel(key), value])
  );
}


function normalizeRows(rows) {
  return rows.map(normalizeKeys);
}

module.exports = { normalizeKeys, normalizeRows };