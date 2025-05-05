
///////////////////////// quote api /////////////////////////
async function fetchZenQuote() {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();

    document.getElementById('quoteoutput').textContent = `"${data[0].q}"`;  // adds quote data into h2 
    document.getElementById('author').textContent = `- ${data[0].a}`; // adds author data intp h2
  } catch (error) {
    document.getElementById('quoteoutput').textContent = 'Failed to load quote.';
    console.error('Error fetching quote:', error);
  }
}
fetchZenQuote();


///////////////////////// annyang api /////////////////////////
if (typeof annyang !== 'undefined') { 
    const commands = {           // sets up commands 
      'hello': () => alert('Hello World'),            // hello
      'change the color to *color': (color) => {            // color 
        document.body.style.backgroundColor = color;       
      },
      'navigate to *page': (page) => {       //navigate diff page 
        const pages = {
          home: 'HomePage.html',
          stocks: 'StockPage.html',
          dogs: 'DogPage.html'
        };
        const lowerPage = page.toLowerCase();
        if (pages[lowerPage]) {
          window.location.href = pages[lowerPage];
        } else {
          alert(`Page "${page}" not found.`);
        }
      },
      'load dog breed *breedName': function(breedName) {                     // dog breeds 
        const lowerName = breedName.toLowerCase();
        const match = allBreeds.find(b => b.attributes.name.toLowerCase() === lowerName);    //loads all dog breed first 
        if (match) {
        showBreedInfo(match);
        } else {
    alert(`Could not find breed: ${breedName}`);
  }
}
    };
  
    annyang.addCommands(commands);
  

///////////////////////// mic buttons /////////////////////////

    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('start-mic').addEventListener('click', () => {        // on click mic turns on or off 
        annyang.start();
        console.log('The Mic on');
      });
  
      document.getElementById('stop-mic').addEventListener('click', () => {
        annyang.abort();
        console.log('The Mic off');
      });
    });

  } else {
    console.log('Annyang is not supported in this browser.');
  }
  
///////////////////////// dog breed & img api /////////////////////////

async function fetchBreeds() { 
  const res = await fetch('https://dogapi.dog/api/v2/breeds');               // loads breeds in from dog api 
  const data = await res.json();
  return data.data;
}

///////////////////////// create slider /////////////////////////
function createCarousel(imageUrls) {
  const carousel = document.getElementById('carousel');
  carousel.innerHTML = ''; 

  imageUrls.forEach(url => {                               // dog images 
    const slide = document.createElement('div');
    slide.classList.add('slide');
    const img = document.createElement('img');
    img.src = url;
    img.style.width = '300px';
    img.style.height = '300px';
    slide.appendChild(img);
    carousel.appendChild(slide);
  });


  const images = carousel.getElementsByTagName('img');       
  let loadedImages = 0;
  for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('load', () => {
      loadedImages++;
      if (loadedImages === images.length) {

        $('.slider-container').simpleSlider({         // timer for the slides 
          duration: 1,
          delay: 1,
          autoplay: true
        });
        console.log('SimpleSlider initialized');
      }
    });
  }
}

///////////////////////// create buttons /////////////////////////

async function loadBreedButtons() {

  const imgRes = await fetch('https://dog.ceo/api/breeds/image/random/10');
  const imgData = await imgRes.json();
  createCarousel(imgData.message);


  const breedsRes = await fetch('https://dogapi.dog/api/v2/breeds');
  const breedsData = await breedsRes.json();
  const breeds = breedsData.data;
  allBreeds = breeds; 


  const buttonContainer = document.getElementById('breed-buttons');    // generates the dog name buttons 
  breeds.forEach(breed => {
    const btn = document.createElement('button');
    btn.textContent = breed.attributes.name;
    btn.classList.add('breed-button');
    btn.addEventListener('click', () => showBreedInfo(breed));    // shows info on click 
    buttonContainer.appendChild(btn);
  });
} 

///////////////////////// create info for dogs /////////////////////////

function showBreedInfo(breed) {                                 // generates the descriptions of the dogs 
  const { name, description, life } = breed.attributes;
  
  document.getElementById('breed-name').textContent = name;
  document.getElementById('breed-desc').textContent = description;
  document.getElementById('min-life').textContent = life?.min;
  document.getElementById('max-life').textContent = life?.max;
  document.getElementById('breed-info').classList.remove('hidden');
}
  
  loadBreedButtons();
  