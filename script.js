
const form = document.getElementById('form')
const dates = document.getElementById('date')
const favoritesSection = document.getElementById('favorites')
const explanation = document.getElementById('explanation')
const items = document.getElementById('items')

// Retrieve favorites from localStorage, or set an empty array if it doesn't exist
let favorites
if (localStorage.getItem('favorites')) {
favorites = JSON.parse(localStorage.getItem('favorites'))
} else {
favorites = []
}

// Handle form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault()
  const date = dates.value;
  const apiKey = 'lnGIvMUmgxfIVzUKWPURyxm1XhgPqm5lN729SQ7R';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
  const response = await fetch(url)
  if (response.ok) {
    const data = await response.json()
    showPictureOfTheDay(data)
  }
})

// Display Astronomy Picture of the Day
function showPictureOfTheDay(data) {
  let pictureContainer = document.getElementById('pictureContainer')
  
// Remove existing picture container
  if (pictureContainer) {
    pictureContainer.remove()
  }
  
  // Create new picture container
  pictureContainer = document.createElement('div')
  pictureContainer.id = 'pictureContainer'
  
  // Create the elements for the explanation
  const title = document.createElement('h2')
  title.textContent = data.title;
    const date = document.createElement('h2')
    date.classList.add('daty')
    date.textContent = `(${data.date})`
    const description = document.createElement('div')
    description.textContent = data.explanation
  
    // Create a save button
    const save = document.createElement("button")
    save.textContent = 'Save to favorites'
    save.addEventListener('click', function() {
      addTofavorite(data)
    });
  
    pictureContainer.append(title, date, description, save)
  
    items.appendChild(pictureContainer)
  
    // Call a separate function to display the image
    displayImage(data)
  }
  
  function displayImage(data) {
    // Remove existing picture frame
    let pictureFrame= document.getElementById('pictureFrame')
    if (pictureFrame) {
      pictureFrame.remove()
    }
  
    // Create a new div to hold the image
    pictureFrame = document.createElement('div')
    pictureFrame.setAttribute('id', 'pictureFrame')
    pictureFrame.setAttribute('tabIndex', '0')
  
    let highResolution = null
  
    pictureFrame.addEventListener('click', function() {
      if (highResolution) {
        highResolution.remove()
      }
      highResolution = superiorResolution(data)
    })
  
  
    // Add event listener to document to remove HD image when clicked anywhere
    document.addEventListener('click', function(event) {
      const clickedElement = event.target;
      if (clickedElement.classList.contains('highResolution')) {
        clickedElement.remove()
        highResolution = null
      }
    });
    
  
    // Add event listener to form to remove HD image when submitted
  
    const image = document.createElement('img')
  image.setAttribute('src', data.url)
  image.setAttribute('alt', data.title)

  // Append the image to the image container
  pictureFrame.appendChild(image)

  explanation.appendChild(pictureFrame)
}

function createImage(data) {
  // Create the wrapper for the image and details
  const wrapper = document.createElement('div')
  wrapper.classList.add('wrapper')

  // Create the image element and set its attributes
  const favImage = document.createElement('img');
  favImage.src = data.url;
  favImage.alt = data.description;

  // Create the title element and set its text content
  const favTitle = document.createElement('h2');
  favTitle.textContent = data.title

  // Create the date element and set its text content
  const favDate = document.createElement('h2')
  favDate.classList.add('favdate')
  favDate.textContent = `(${data.date})`

  // Create the clear button 
  const clear = document.createElement("button")
  clear.textContent = 'Delete'
  clear.classList.add('clear')
  clear.addEventListener('click', function() {
    console.log('Delete button clicked!')
    localStorage.removeItem('data')
    removeFavorite(data, wrapper)
  });

  // Append the elements to the wrapper in the desired order
  wrapper.append(favImage, favTitle, favDate)
  favTitle.appendChild(clear)
  // Append the wrapper to the document body
  document.body.append(wrapper);
}
function addTofavorite(data) {
  let isDuplicate = false;
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].title === data.title) {
      isDuplicate = true;
      break;
    }
  }
  if (!isDuplicate) {
    storeFavoriteLocally(data);
    favorites.push(data);
    renderFavorites(true);
  } else {
    alert('This image is already in your favorites list!')
  }
}
function superiorResolution (data) {
  const highResolution = new Image()
  highResolution.src = data.hdurl || data.url
  highResolution.alt = data.title
  highResolution.classList.add('highResolution')
  highResolution.addEventListener('click', function() {
    highResolution.remove();
  });
  document.body.appendChild(highResolution)
  return highResolution
}

function renderFavorites (numFavorites = favorites.length) {
  favoritesSection.innerHTML = ''

  if (favorites.length > 0) {
    for (let i = favorites.length - 1; i >= favorites.length - numFavorites; i--) {
      if (favorites[i]) {
        createImage(favorites[i])
      }
    }
  }
}



// Save favorite to localStorage
function storeFavoriteLocally(favorite) {
  favorites.push(favorite);
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

// Remove favorite from localStorage
function removeFavorite(favorite, wrapper) {
  favorites = favorites.filter((fav) => fav.url !== favorite.url);
  localStorage.setItem('favorites', JSON.stringify(favorites))
  wrapper.remove()

  const message = document.getElementById('favoriteTitle')
  if (favorites.length === 0) {
    message.style.display = 'none'
  }
}




renderFavorites()