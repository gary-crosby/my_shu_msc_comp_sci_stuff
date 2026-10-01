/* JavaScript code for Week 5 Discussion 5.4

TODO:
  DONE -- 0. Create planet class
  DONE -- 1. Read and parse JSON for planet and characteristics data
  2. Build checkboxes for Planets (HTML DOM)
  3. Populate data window on every user selection change
  5. Add Clear Selections button functionality
 */

// Setup some globals
const dataFile = "solar_system_data.json";
let planetData = null;
const planets = [];
let earthMassKg = null; // Will be set after loading planet data

// Define the Planet class
class Planet {
  constructor(
    name,
    type,
    orbitKm,
    orbitYr,
    massKg,
    moonsPerm = "None",
    moonsProv = "None",
  ) {
    this.name = name;
    this.type = type; // e.g., "Terrestrial", "Gas Giant", "Ice Giant", "Dwarf Planet"
    this.massKg = massKg; // in kg
    this.massEarths = Number(this.massKg / earthMassKg).toFixed(2);
    this.orbitYr = Number(orbitYr); // in years
    this.orbitKm = Number(orbitKm); // in km
    this.orbitAu = Number((orbitKm / 149597870.7).toFixed(2)); // Convert km to AU rounded to 2 decimal places
    this.moonsPerm = moonsPerm; // TODO: Populate this later if moonsPerm > 0
    this.moonsProv = moonsProv; // TODO: Populate this later if moonsProv > 0
  }
}

// Read JSON file into a JSON object
async function loadPlanetData() {
  try {
    const response = await fetch(dataFile);
    if (!response.ok) {
      throw new Error(`Could not load ${dataFile}: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error loading planet data:", error);
  }
}

// Function to process planet data and create Planet objects
function processPlanetData(data) {
  if (!data || !data.planets) {
    console.error("Invalid data format:", data);
    return;
  } else {
    // Find Earth mass in kg from the data
    const earthData = data.planets.find(
      (planet) => planet.name.toLowerCase() === "earth",
    );
    if (earthData) {
      earthMassKg = earthData.mass_kg;
    }

    // Create Planet objects for each planet in the data
    data.planets.forEach((planetData) => {
      const planet = new Planet(
        planetData.name,
        planetData.type,
        planetData.distance_from_sun_km,
        planetData.orb_yr,
        planetData.mass_kg,
        planetData.moons.permanently_named,
        planetData.moons.moons_prov,
      );
      planets.push(planet);
      console.log(`Created Planet object for ${planet.name}:`, planet);
    });
  }
}

// Dynamically buld checkboxes for planets
function buildPlanetCheckboxes() {
  const planetCheckboxContainer = document.getElementById("planet-list");
  planets.forEach((planet) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `planet_${planet.name}`;
    checkbox.value = planet.name;
    const label = document.createElement("label");
    label.htmlFor = `planet_${planet.name}`;
    label.textContent = planet.name;
    planetCheckboxContainer.appendChild(checkbox);
    planetCheckboxContainer.appendChild(label);
  });
}

// Call the function to load planet data, then process it, and build planet checkboxes
loadPlanetData().then((data) => {
  planetData = data;
  console.log("Planet data loaded:", planetData);
  processPlanetData(planetData);
  buildPlanetCheckboxes();
});
