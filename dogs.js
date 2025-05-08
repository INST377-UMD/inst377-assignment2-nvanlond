function loadDogImages() {
  fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('myslider');
      container.innerHTML = '';

      data.message.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = 'auto';
        img.style.height = '100%';
        container.appendChild(img);
      });

      simpleslider.getSlider({
        container: container,
        delay: 3,
        duration: 0.5
      });

      container.style.display = 'block';
    })
}

function loadBreedButtons() {
  fetch('https://dogapi.dog/api/v2/breeds')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('breed-buttons');

      data.data.forEach(breed => {
        const btn = document.createElement('button');
        btn.className = 'custom-button';
        btn.textContent = breed.attributes.name;
        btn.onclick = () => showBreedInfo(breed);
        container.appendChild(btn);
      });

      addVoiceCommands(data.data);
    })
}

function showBreedInfo(breed) {
  const infoBox = document.getElementById('breed-info');
  const container = document.getElementById('breed-info-container');
  const { name, description, life } = breed.attributes;

  infoBox.innerHTML = `
    <h3>${name}</h3>
    <p><strong>Lifespan:</strong> ${life.min} - ${life.max} years</p>
    <p>${description || "No description available."}</p>
  `;
  container.style.display = 'block';
}

function addVoiceCommands(breedList) {
  if (annyang)  {

    const baseCommands = setupVoiceCommands();
    const commands = { ...baseCommands,
      'load dog breed *name': function (name) {
        const match = breedList.find(b =>
          b.attributes.name.toLowerCase() === name.toLowerCase()
        );
        if (match) {
          showBreedInfo(match);
        } else {
          alert(`Breed "${name}" not found.`);
        }
      }
    };

    annyang.addCommands(commands);
  }
}

function init() {
  loadDogImages();
  loadBreedButtons();
}

window.onload = init;
