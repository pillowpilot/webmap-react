import dataset from "./data/dataset.json";

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

const getAll = (propertyExtractor) => {
  let thingsSoFar = new Set();
  dataset.forEach((row) => thingsSoFar.add(propertyExtractor(row)));
  return [...thingsSoFar]; // Using the spread operator (...) to transfer from set to new array
};

const getAllProducts = () => getAll((row) => row.product);
const getAllTypes = () => getAll((row) => row.type);
const getAllYears = () => getAll((row) => row.year);

export const products = getAllProducts();
export const types = getAllTypes();
export const years = getAllYears();
