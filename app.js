const POKE_URL = "https://pokeapi.co/api/v2/pokemon";

const headerSearchForm = document.querySelector(".nav__form");
const headerSearchField = document.querySelector(".nav__search");
const searchButton = document.querySelector(".btn--search");
const searchField = document.querySelector(".nav__input");
const pokemonContainer = document.querySelector(".hero__pokemon-list");
const getPokemonButton = document.querySelector(".btn--feed");

// functions
const fetchIndividualPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
async function fetchPokemonList(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("network didn't respond correctly!!");

    const data = await response.json();
    console.log(data.results);
    return data.results;
  } catch (error) {
    console.error(error);
  }
}
const triggerBattleEffects = (container) => {
  const cards = container.querySelectorAll(".pokemon__card");

  cards.forEach((card) => {
    card.classList.remove("shake-trigger");
    void card.offsetWidth;
    card.classList.add("shake-trigger");
    const glare = card.querySelector(".glare-swipe");

    if (glare) {
      glare.style.animation = "none";
      void glare.offsetWidth;
      glare.style.animation = "glare-swipe 0.5s ease-in-out forwards";
    }
  });
};
const createPokemon = (array) => {
  array.forEach(async (item) => {
    // variables
    const li = document.createElement("li");
    li.className = "pokemon";
    const liMainContainer = document.createElement("article");
    liMainContainer.className = "pokemon__main-container";
    pokemonContainer.appendChild(li);
    li.appendChild(liMainContainer);
    const leftCard = document.createElement("div");
    leftCard.classList = "pokemon__card";
    const rightCard = document.createElement("div");
    rightCard.classList = "pokemon__card";
    const liH2 = document.createElement("h2");
    liH2.className = "pokemon__title";
    liH2.textContent = item.name;
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "pokemon__cards-container";
    const criesContainer = document.createElement("div");
    criesContainer.className = "pokemon__cries-container";

    // append h2, left column, right column, and cries
    liMainContainer.appendChild(liH2);
    liMainContainer.appendChild(cardsContainer);
    liMainContainer.appendChild(criesContainer);
    cardsContainer.appendChild(leftCard);
    cardsContainer.appendChild(rightCard);

    // fetch the rest of the stats

    const pokeStats = await fetchIndividualPokemon(item.url);

    // left column
    const liLeftH3 = document.createElement("h3");
    liLeftH3.className = "pokemon__card-title";
    liLeftH3.textContent = `Front`;
    leftCard.appendChild(liLeftH3);

    const liImgFront = document.createElement("img");
    liImgFront.src = pokeStats.sprites.front_default;
    liImgFront.className = "pokemon__card-img";
    leftCard.appendChild(liImgFront);

    const movesContainer = document.createElement("ul");
    movesContainer.className = "pokemon__moves";
    leftCard.appendChild(movesContainer);

    const movesTitle = document.createElement("p");
    movesTitle.textContent = "Moves:";
    movesContainer.appendChild(movesTitle);

    pokeStats.abilities.forEach((ability) => {
      const moveName = ability.ability.name;
      const move = document.createElement("li");
      move.className = "pokemon__move";
      move.textContent = moveName;
      movesContainer.appendChild(move);
    });

    // right column
    const liRightH3 = document.createElement("h3");
    liRightH3.className = "pokemon__card-title";
    liRightH3.textContent = `Back`;
    rightCard.appendChild(liRightH3);

    const liImgBack = document.createElement("img");
    liImgBack.src = pokeStats.sprites.back_default;
    liImgBack.className = "pokemon__card-img";
    rightCard.appendChild(liImgBack);

    const statsContainer = document.createElement("div");
    statsContainer.classList = "pokemon__stats";
    rightCard.appendChild(statsContainer);

    const statsTitle = document.createElement("p");
    statsTitle.textContent = "Stats:";
    statsTitle.classList = "pokemon__stats-title";
    statsContainer.appendChild(statsTitle);

    const height = document.createElement("p");
    height.className = "pokemon__height";
    height.textContent = `Height: ${pokeStats.height}`;
    statsContainer.appendChild(height);

    const weight = document.createElement("p");
    weight.className = "pokemon__weight";
    weight.textContent = `Weight: ${pokeStats.weight}`;
    statsContainer.appendChild(weight);

    const leftGlare = document.createElement("div");
    leftGlare.className = "glare-swipe";
    leftCard.appendChild(leftGlare);

    const rightGlare = document.createElement("div");
    rightGlare.className = "glare-swipe";
    rightCard.appendChild(rightGlare);

    // cries

    const cryAudio = document.createElement("audio");
    cryAudio.className = "pokemon__cry-audio";
    cryAudio.src = pokeStats.cries.latest;
    cryAudio.controls = true;
    cryAudio.volume = 0.1;
    cryAudio.addEventListener("play", () => {
      triggerBattleEffects(liMainContainer);
    });
    criesContainer.appendChild(cryAudio);
  });
};

// event listeners
window.addEventListener("load", async (e) => {
  e.preventDefault();
  const randomOffset = Math.floor(Math.random() * 1005);
  const randomURL = `${POKE_URL}?offset=${randomOffset}&limit=10`;
  const pokemonArray = await fetchPokemonList(randomURL);
  createPokemon(pokemonArray);
});

headerSearchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerms = searchField.value;
  const searchURL = `${POKE_URL}/${searchTerms}`;

  if (searchTerms) {
    try {
      const response = await fetch(searchURL);
      if (!response.ok) throw new Error("Pokemon not found!");
      const data = await response.json();

      pokemonContainer.innerHTML = "";

      const resultArray = [
        {
          ...data,
          url: searchURL,
        },
      ];

      createPokemon(resultArray);
    } catch (error) {
      console.error(error);
      alert("Pokemon not found! Check your spelling!");
    }
  } else {
    alert("Please enter something in the field before you search!!");
  }
});

getPokemonButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const randomOffset = Math.floor(Math.random() * 1005);
  const randomURL = `${POKE_URL}?offset=${randomOffset}&limit=10`;

  pokemonContainer.innerHTML = "";
  const pokemonArray = await fetchPokemonList(randomURL);
  createPokemon(pokemonArray);
});
