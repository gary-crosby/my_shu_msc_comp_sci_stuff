/* JavaScript code for Week 5 Discussion 5.4

TODO:
  1. Read and parse JSON for planet and characteristics data
  2. Build checkboxes for Planets (HTML DOM)
  3. Build checkboxes for Characteristics (HTML DOM)
  4. Populate data window on every user selection change
  5. Add Clear Selections button functionality
 */

// Setup some globals
planets = [];
earth_mass_kg = 0;

// Read JSON file
fetch('planets.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Could not load planets.json: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data); // Inspect the JSON in the browser console

    planets = data;
  })
  .catch(error => {
    console.error('Error loading planet data:', error);
  });
