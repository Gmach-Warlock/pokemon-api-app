const POKE_URL = "https://pokeapi.co/api/v2/pokemon";

const headerSearchForm = document.querySelector(".header-search-form");
const headerSearchField = document.querySelector(".header-search-field");
const searchButton = document.querySelector(".header-search-button");
const pokemonContainer = document.querySelector(".pokemon-container");

headerSearchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  async function fetchPokemonList(searchParam) {
    try {
      const response = await fetch(POKE_URL);
      if (!response.ok) throw new Error("network didn't respond correctly!!");

      const data = await response.json();
      console.log(data.results);
      return data.results;
    } catch (error) {
      console.error(error);
    }
  }

  const pokemonArray = await fetchPokemonList();
  pokemonArray.forEach(async (item) => {
    // variables
    const li = document.createElement("li");
    li.className = "pokemon-card";
    pokemonContainer.appendChild(li);
    const leftCard = document.createElement("div");
    leftCard.className = "pokemon-left-card";
    const rightCard = document.createElement("div");
    rightCard.className = "pokemon-right-card";

    // append left & right columns
    li.appendChild(leftCard);
    li.appendChild(rightCard);

    // fetch the rest of the stats
    const fetchIndividualPokemon = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    };
    const pokeStats = await fetchIndividualPokemon(item.url);

    // left column
    const liLeftH2 = document.createElement("h2");
    liLeftH2.textContent = item.name;
    leftCard.appendChild(liLeftH2);

    const liImgFront = document.createElement("img");
    liImgFront.src = pokeStats.sprites.front_default;
    liImgFront.className = "pokemon-img-front";
    leftCard.appendChild(liImgFront);

    // right column
    const liRightH2 = document.createElement("h2");
    liRightH2.textContent = item.name;
    rightCard.appendChild(liRightH2);

    const liImgBack = document.createElement("img");
    liImgBack.src = pokeStats.sprites.back_default;
    rightCard.appendChild(liImgBack);
  });
});
