import dataset from "./data/dataset.json";

const regionsNameToIdMapping = [
  { name: "Concepción", id: 1 },
  { name: "San Pedro", id: 2 },
  { name: "Coordillera", id: 3 },
  { name: "Guairá", id: 4 },
  { name: "Caaguazú", id: 5 },
  { name: "Caazapa", id: 6 },
  { name: "Itapúa", id: 7 },
  { name: "Misiones", id: 8 },
  { name: "Paraguarí", id: 9 },
  { name: "Alto Paraná", id: 10 },
  { name: "Central", id: 11 },
  { name: "Ñeembucú", id: 12 },
  { name: "Amambay", id: 13 },
  { name: "Canindeyú", id: 14 },
  { name: "Pte Hayes", id: 15 },
  { name: "Alto Paraguay", id: 16 },
  { name: "Boquerón", id: 17 },
];

export const regionDataFromName = (name) =>
  regionsNameToIdMapping.filter((o) => o.name === name)[0];

export const regionDataFromId = (id) =>
  regionsNameToIdMapping.filter((o) => o.id === id)[0];

export const filterData = (product, type, year) =>
  dataset.filter(
    (row) =>
      row.product === product &&
      row.type === type &&
      row.year === year &&
      row.administrative_region !== 0
  );

export const filterEvolutionOfProductInRegion = (product, type, region) => {
  let data = [];
  dataset.forEach((row) => {
    if (
      row.product === product &&
      row.type === type &&
      row.administrative_region === region
    )
      data.push({
        year: row.year,
        amount: row.amount,
      });
  });
  return data;
};

export const filterAmountsOfProductsInYear = (product, type, year) => {
  let data = [];
  dataset.forEach((row) => {
    if (row.product === product && row.type === type && row.year === year)
      data.push({
        region: row.administrative_region,
        amount: row.amount,
      });
  });
  return data;
};

const getAll = (propertyExtractor) => {
  let thingsSoFar = new Set();
  dataset.forEach((row) => thingsSoFar.add(propertyExtractor(row)));
  return [...thingsSoFar]; // Using the spread operator (...) to transfer from set to new array
};

const getAllProducts = () => getAll((row) => row.product);
const getAllTypes = () => getAll((row) => row.type);
const getAllYears = () => getAll((row) => row.year);
const getAllAdministrativeRegionsIds = () =>
  getAll((row) => row.administrative_region);

export const products = getAllProducts();
export const types = getAllTypes();
export const years = getAllYears();
export const regions = getAllAdministrativeRegionsIds();
export const regionsNames = regionsNameToIdMapping.map((o) => o.name);
