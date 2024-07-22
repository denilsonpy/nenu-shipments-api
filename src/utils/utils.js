export function checkFreightPrice(rules, location) {
  // rules = {regionType, name, price}
  const formattedCity = formatName(location.city);
  const formattedState = formatName(location.state);
  const formattedRules = rules.map((region) => ({
    ...region,
    city: formatName(region.city),
    state: formatName(region.state),
  }));
  const cityRegion = formattedRules.filter(
    (region) => region.region_type === "city"
  );
  const stateRegion = formattedRules.filter(
    (region) => region.region_type === "state"
  );
  const defaultRegion = formattedRules.find(
    (region) => region.region_type === "all"
  );

  const matchCity = cityRegion.find(
    (region) => region.city === formattedCity && region.state === formattedState
  );
  if (matchCity) return matchCity?.price;
  const matchState = stateRegion.find(
    (region) => region.state === formattedState
  );
  if (matchState) return matchState?.price;
  return defaultRegion?.price || 0;
}

export function formatName(name) {
  return name
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric characters (excluding spaces)
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_{2,}/g, "_"); // Replace multiple consecutive underscores with a single underscore
}

// console.log(
//   [
//     {
//       state: "São Paulo",
//       city: "São Bernardo do Campo",
//     },
//     {
//       state: "São Paulo",
//       city: "São Paulo",
//     },
//     { state: "São Paulo", city: "Caieiras" },
//     { state: "Alagoas", city: "Cajueiro" },
//   ].forEach((data) => {
//     console.log(
//       data,
//       checkFreightPrice(
//         [
//           {
//             region_type: "city",
//             city: "São Paulo",
//             state: "São Paulo",
//             price: 10,
//             _id: "669e7ac93d3f5eb1fc61d9bb",
//           },
//           {
//             region_type: "state",
//             city: "all",
//             state: "São Paulo",
//             price: 20,
//             _id: "669e7ac93d3f5eb1fc61d9bc",
//           },
//           {
//             region_type: "all",
//             city: "all",
//             state: "all",
//             price: 30,
//             _id: "669e7ac93d3f5eb1fc61d9bd",
//           },
//         ],
//         data
//       )
//     );
//   })
// );
