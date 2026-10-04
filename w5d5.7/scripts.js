// JavaScript for Week 5 Discussion 5.7: Random XKCD Comic Viewer

// function to fetch a random XKCD comic and display it
// XKCD API dooes not need an API key - yay!
async function fetchRandomXKCDComic() {
  try {
    // Fetch the latest comic to get the total number of comics
    const latestResponse = await fetch("https://xkcd.com/info.0.json");
    if (!latestResponse.ok) {
      throw new Error(`Could not fetch latest XKCD comic: ${latestResponse.status}`);
    }
    const latestData = await latestResponse.json();
    const latestComicNum = latestData.num; 
    console.log(`Latest XKCD comic number: ${latestComicNum}`);
    // Generate a random comic number between 1 and the latest comic number
    const randomComicNum = Math.floor(Math.random() * latestComicNum) + 1;
    console.log(`Random XKCD comic number: ${randomComicNum}`); 
  } catch (error) {
    console.error("Error fetching latest XKCD comic:", error);
    alert("Failed to fetch the latest XKCD comic. Please try again later.");
    return;  
  }
}

fetchRandomXKCDComic();

