/* JavaScript code for Week 5 Discussion 5.4

TODO:
  0. Create planet class
  1. Read and parse JSON for planet and characteristics data
  2. Build checkboxes for Planets (HTML DOM)
  3. Build checkboxes for Characteristics (HTML DOM)
  4. Populate data window on every user selection change
  5. Add Clear Selections button functionality
 */

// Setup some globals
planets = [];
earth_mass_kg = 0;

// 0. Create planet class
class Planet {
  constructor(
    name,
    mass_kg,
    type,
    orbit_km,
    orbit_yr,
    moons_perm = null,
    moons_prov = null,
    mass_earth = null,
    orbit_au = null,
  ) {
    this.name = name;
    this.mass_kg = mass_kg; // in kg
    this.type = type;
    this.orbit_km = orbit_km; // in km
    this.orbit_yr = orbit_yr; // in years
    this.moons_perm = moons_perm; // TODO: Populate this later if moons_perm > 0
    this.moons_prov = moons_prov; // TODO: Populate this later if moons_prov > 0
    this.mass_earth = mass_earth; 
    this.orbit_au = (orbit_km / 149597870.7).toFixed(2); // Convert km to AU rounded to 2 decimal places
  }
}

// 1.1 Read JSON file
fetch("solar_system_data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Could not load planets.json: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    planet_data = data;
    console.log(planet_data); // Inspect the JSON in the browser console
  })
  .catch((error) => {
    console.error("Error loading planet data:", error);
  });

// 1.2 Parse JSON data and store in global array that holds Planet objects
