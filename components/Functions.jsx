function ConvertJSONtoTable(DataJSON = [], fields = {}) {
  let columns = Object.values(fields);
  let rows = DataJSON.map((obj) =>
    Object.keys(fields).map((field) => obj[field])
  );
  return { columns: columns, rows: rows };
}
export default ConvertJSONtoTable;

export function toTitleCase(str, length = 10) {
  str = str.replace(/[^a-zA-Z0-9_-\s]/g, "");
  if (!/[a-zA-Z]/.test(str.charAt(0))) {
    str = str.substring(1);
  }
  str = str.substr(0, length);
  return str.replace(
    /([a-zA-Z0-9]+)([-_\s]*)([a-zA-Z0-9]*)/g,
    function (_, p1, p2, p3) {
      let cappedP1 = p1.charAt(0).toUpperCase() + p1.substr(1).toLowerCase();
      let cappedP3 = p3.charAt(0).toUpperCase() + p3.substr(1).toLowerCase();
      return cappedP1 + p2 + cappedP3;
    }
  );
}

export function removeNonAlphanumeric(str, length = 10) {
  return str
    .replace(/ /g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .substr(0, length);
}

export function theNameExist(name, list) {
  return list.some((objeto) => objeto.name === name);
}

export function toAlphaUpperCase(input, length) {
  return input
    .toUpperCase()
    .replace(/[^A-ZÑÁÉÍÓÚ]/g, "")
    .substr(0, length);
}
