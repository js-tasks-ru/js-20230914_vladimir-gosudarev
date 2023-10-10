/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @param value param for sorting object fields
 * @param valueType param - the sorting type "string" or "number"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc', value = '', valueType = 'string') {
  if (!arr || !arr.length) {
    return null
  }

  if (!value) {
    return param === 'asc' ? [...arr].sort((a, b) => sortFunction(a, b)) : [...arr].sort((a, b) => sortFunction(b, a));
  }

  return param === 'asc' ? [...arr].sort((a, b) => sortFunction(a, b, value, valueType)) : [...arr].sort((a, b) => sortFunction(b, a, value, valueType));
}

function sortFunction(a, b, value = '', type = '') {
  if (type === 'number') {
    return value ? a[value] - b[value] : a - b;
  }

  return value ? a[value].localeCompare(b[value], 'ru', {caseFirst: 'upper'}) : a.localeCompare(b, 'ru', {caseFirst: 'upper'});
}
