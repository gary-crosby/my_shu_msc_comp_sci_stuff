// JavaScript code for Week 5 Discussion 5.4

// Setup some globals
const dataFile = "solar_system_data.json";
let planetData = null;
const planets = [];
let earthMassKg = null; // Will be set when loading planet data

// Define the Planet class
class Planet {
  constructor(
    name,
    type,
    orbitKm,
    orbitYr,
    massKg,
    moonsPerm,
    moonsProv,
    massEarths = null,
    orbitAu = null,
  ) {
    this.name = name;
    this.type = type; // e.g., "Terrestrial", "Gas Giant", "Ice Giant", "Dwarf Planet"
    this.massKg = massKg; // in kg
    this.massEarths = (this.massKg / earthMassKg).toFixed(4);
    this.orbitYr = orbitYr; // in years
    this.orbitKm = orbitKm; // in km
    this.orbitAu = (orbitKm / 149597870.7).toFixed(2); // Convert km to AU rounded to 2 decimal places
    this.moonsPerm = moonsPerm;
    if (moonsPerm.length === 0) {
      this.moonsPerm = "None";
    }
    this.moonsProv = moonsProv;
    if (moonsProv === 0) {
      this.moonsProv = "None";
    }
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
        planetData.moons.provisional_count,
      );
      planets.push(planet);
      console.log(`Created Planet object for ${planet.name}:`, planet);
    });
  }
}

// Dynamically build checkboxes for planets and add to HTML DOM
function buildPlanetCheckboxes() {
  const planetCheckboxContainer = document.getElementById("planet-list");
  planets.forEach((planet) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `planet_${planet.name}`;
    checkbox.value = planet.name;
    checkbox.name = "planet"; // Group checkboxes by name for easier selection later
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(planet.name));
    planetCheckboxContainer.appendChild(label);
  });
}

// Call the function to load planet data, process it, and dynamically add planet checkboxes
loadPlanetData().then((data) => {
  planetData = data;
  console.log("Planet data loaded:", planetData);
  processPlanetData(planetData);
  buildPlanetCheckboxes();
});

// Add event listeners to checkboxes to update the data window on selection change
document.addEventListener("change", (event) => {
  if (event.target.name === "details" || event.target.name === "planet") {
    updateDataWindow();
  }
});

// Update the data window based on selected planets and characteristics
function updateDataWindow() {
  console.log("Updating data window based on user selections...");
  const textarea = document.getElementById("data-output");
  textarea.value =
    "Please wait while we update this window based on your selections...";
  // Check which planets are selected
  const selectedPlanets = Array.from(
    document.querySelectorAll('input[name="planet"]:checked'),
  ).map((checkbox) => checkbox.value);
  // Check which characteristics are selected
  const selectedCharacteristics = Array.from(
    document.querySelectorAll('input[name="details"]:checked'),
  ).map((checkbox) => checkbox.value);
  // Log the selected planets and characteristics for debugging
  //console.log("Selected planets:", selectedPlanets);
  //console.log("Selected characteristics:", selectedCharacteristics);
  // Update display based on whether planet(s) and/or characteristics are selected
  //
  // No planets and no characteristics selected
  if (selectedPlanets.length === 0 && selectedCharacteristics.length === 0) {
    clearSelections();
  }
  // No planets selected, but characteristics are selected
  else if (selectedPlanets.length === 0) {
    textarea.value = "Please select at least one planet to see the data.";
  }
  // No characteristics selected, but planets are selected
  else if (selectedCharacteristics.length === 0) {
    textarea.value =
      "Please select at least one characteristic to see the data.";
  } else {
    // Both planets and characteristics are selected, so display the data
    let output = "";
    selectedPlanets.forEach((planetName) => {
      const planet = planets.find((p) => p.name === planetName);
      if (planet) {
        output += formatPlanetData(planet, selectedCharacteristics);
        if (selectedPlanets.length > 1) {
          output += "\n\n"; // Add a blank line between planets if >1 are selected
        }
      }
    });
    textarea.value = output;
    textarea.scrollTop = 0; // Scroll to the top of the textarea after updating
  }
}

// Clear selections and reset the data window
function clearSelections() {
  console.log("Resetting data window and clearing selections...");
  // Reset the data window to its initial state
  const textarea = document.getElementById("data-output");
  textarea.value =
    "Please select at least one planet and one characteristic to see the data.";
  // Clear all checkboxes ...
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  console.log("Window reset and all selections cleared.");
}

function formatPlanetData(planet, characteristics) {
  // This function formats the planet data for display in the textarea
  // Accepts a Planet object and an array of selected characteristics
  console.log(`Formatting data for planet: ${planet.name}`);
  console.log(`Selected characteristics: ${characteristics}`);
  let output = `Planet: ${planet.name}\n`;
  const asterisks = "*".repeat(9 + planet.name.length);
  output += asterisks + "\n";
  console.log(`Planet data:`, planet);
  characteristics.forEach((characteristic) => {
    switch (characteristic) {
      case "type":
        output += `Type: ${planet.type}\n`;
        break;
      case "massEarths":
        output += `Mass (Earth masses): ${planet.massEarths}\n`;
        break;
      case "orbitYr":
        output += `Orbital period (years): ${planet.orbitYr}\n`;
        break;
      case "orbitAu":
        output += `Orbital distance from Sun (AU): ${planet.orbitAu}\n`;
        break;
      case "moons":
        if (planet.moonsPerm !== "None") {
          const moonList = planet.moonsPerm.join(", ");
          output += `Moons (permanently named): ${moonList}\n`;
        } else {
          output += `Moons (permanently named): ${planet.moonsPerm}\n`;
        }
        output += `Moons (provisional): ${planet.moonsProv}\n`;
        break;
      default:
        console.log(`Unknown characteristic: ${characteristic}`);
    }
  });
  return output;
}
