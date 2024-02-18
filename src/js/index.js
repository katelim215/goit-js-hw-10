import { fetchBreeds, fetchCatByBreed } from "./cat-api.js";
import SlimSelect from "slim-select";
import 'slim-select/dist/slimselect.css';
import Notiflix from "notiflix";

const breedSelect = document.querySelector(".breed-select");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
const catInfo = document.querySelector(".cat-info");

function chooseBreed(data) {
    fetchBreeds(data)
        .then(breeds => {
            breeds.forEach(breed => {
                const option = document.createElement("option");
                option.value = breed.id;
                option.textContent = breed.name;
                breedSelect.appendChild(option);
            });
            
            new SlimSelect({
                select: breedSelect,
                placeholder: 'Select breed',
            })

            breedSelect.classList.remove('is-hidden');
        })

        .catch(onError);
}

chooseBreed();

function createMarkup(event) {
    loader.classList.replace('is-hidden', 'loader');
    breedSelect.classList.add('is-hidden');
    catInfo.classList.add('is-hidden');

    const selectedBreedId = event.target.value;
    
    fetchCatByBreed(selectedBreedId)
        .then(catData => {
            const { url, breeds } = catData[0];
            const { name, description, temperament } = breeds[0];

            catInfo.innerHTML = `
            <div class="container">
                <img src="${url}" alt="${name}" width="400" />
                <div class="box">
                    <h2 class="cat-name">${name}</h2>
                    <p class="cat-description">${description}</p>
                    <p><strong>Temperament:</strong> ${temperament}</p>
                </div>
            </div>`;

            catInfo.classList.remove('is-hidden');
            loader.classList.add('is-hidden');
        })

        .catch(onError);
}

breedSelect.addEventListener('change', createMarkup);

function onError() {
    breedSelect.classList.remove('is-hidden');
    error.classList.replace('loader', 'is-hidden');

    Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
}
