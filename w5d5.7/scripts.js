// JavaScript for Week 5 Discussion 5.7: XKCD Comic Randomizer

// For API notes, see the bottom of this file

// Calls an async function to fetch() a random comic
// and the displays the comic on the page
function displayRandomXKCDComic() {
  fetchRandomXKCDComic().then((comic) => {
    if (comic === false) {
      console.error("Failed to fetch random XKCD comic.");
      // TODO add an error message and a fallback display ...
    } else {
      
      const rndComImage = document.getElementById("rnd-com-image");
      const rndComTitle = document.getElementById("rnd-com-title");
      const rndComTxt = document.getElementById("rnd-com-txt");
      rndComTitle.textContent = comic.safe_title;
      rndComImage.src = comic.img;
      rndComImage.alt = comic.alt;
      rndComTxt.textContent = comic.alt;
    }
  });
}

// Fetches a random XKCD comic and returns its data as JSON
// Returns false if there was an error fetching the comic
async function fetchRandomXKCDComic() {
  let latestComicNumber = null;
  let data = null;

  // Get the latest comic book number
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/aghontpi/mirror-xkcd-api/main/syncState.json",
    );
    const data = await response.json();
    latestComicNumber = data.last_update_content.id;
    // console.log(`Latest XKCD comic number: ${latestComicNumber}`);
  } catch (error) {
    console.error("Error fetching latest XKCD comic:", error);
    return false;
  }

  // Generate a random comic number between 1 and the latest comic number
  const randomComicNumber = Math.floor(Math.random() * latestComicNumber) + 1;
  console.log(`Random XKCD comic number: ${randomComicNumber}`);

  // Get the data for the random comic number
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/aghontpi/mirror-xkcd-api/main/api/${randomComicNumber}/info.0.json`,
    );
    data = await response.json();
  } catch (error) {
    console.error("Error fetching random XKCD comic:", error);
    return false;
  }
  return data;
}

/***** Begin API Notes *****
 
  The official XKCD API is a fantastic resource but lacks CORS  headers.
  This makes it challenging to use directly in web applications (like this one)
  hosted on different domains. So, instead of accessing the official XKCD API,
  this web app accesses the mirror at
  https://raw.githubusercontent.com/aghontpi/mirror-xkcd-api/main/api/
  which does support CORS.

  Neither the offical API nor the mirror require an API key.

  To access a specific comic number (e.g., 190) fetch() from:
  https://raw.githubusercontent.com/aghontpi/mirror-xkcd-api/main/api/190/info.0.json

  Which returns something like this:
  {
    "month": "11",
    "num": 190,
    "link": "",
    "year": "2006",
    "news": "",
    "safe_title": "IPoD",
    "transcript": "[[Character 1 - wearing a black hat - sits at a computer. Character 2 stands behind Character 1]]
      Character 1: You see, statisticians communicate using IPoD -- IP over Demographics. For example, the header of
      the next packet I send will be encoded into the New Jersey death rate.
      Character 2: So you're going to hack the census bureau and change the number of reported deaths?
      Character 1: Guess again.
      Character 1: Hey, have you seen my crossbow?
      {{Alt: For smaller numbers he has to SAVE lives.  The birthrate channel is even more of a mixed bag.}}",
    "alt": "For smaller numbers he has to SAVE lives.  The birthrate channel is even more of a mixed bag.",
    "img": "https://imgs.xkcd.com/comics/ipod.png",
    "title": "IPoD",
    "day": "29",
    "mirror_img": "https://raw.githubusercontent.com/aghontpi/mirror-xkcd-api/main/api/190/ipod.png"
  }

  To get the most recent comic number, fetch:
  https://raw.githubusercontent.com/aghontpi/mirror-xkcd-api/main/syncState.json

  which returns something like this:
  {
    "last_update_content": {
      "id": "3083" 
    }
  }

***** End API Notes *****/
