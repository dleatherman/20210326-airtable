var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyLBiQM3uhxBV6DM'}).base('appbhEpIibUEAmBpd');

const typeList = document.getElementById('type-list');
const pokelist = document.getElementById('pokemon-list');
const maxPokmeon = 50;

//get the "pokemon" table from the base, select ALL the records, and specify the functions that will receive the data
base("Types").select({ view: "All" }).eachPage(gotPageOfTypes, gotAllTypes);
base("Pokémon").select({ maxRecords: maxPokmeon, view: "All" }).eachPage(gotPageOfPokemon, gotAllPokemon);

// an empty array to hold our pokemon data
const pokemonArray = [];
const typesArray = [];

// callback function that receives our data
function gotPageOfPokemon(records, fetchNextPage) {
  console.log("gotPageOfPokemon()");
  pokelist.classList.add('loading');
  // add the records from this page to our pokemon array
  pokemonArray.push(...records);
  // request more pages
  fetchNextPage();
}

// call back function that is called when all pages are loaded
function gotAllPokemon(err) {
  console.log("gotAllPokemon()");

  // report an error, you'd want to do something better than this in production
  try {
    pokelist.classList.remove('loading');
    showPokemon();
  } catch (error) {
    error.log(error);
  }
}
// loop through the pokemon, and add it to the page
function showPokemon() {
  console.log("showPokemon()");
  pokemonArray.forEach((pokemon) => {
    if (pokelist) {
      // define and create elements
      let el = document.createElement('li');
      el.classList.add('pokemon-card');
      let p = document.createElement('p');
      let h1 = document.createElement('h1');
      let img = document.createElement('img');
      let hp = document.createElement('div');
      // Set innerHTML of the elements
      h1.innerHTML = pokemon.fields.Name;
      p.innerHTML = pokemon.fields.Description ? pokemon.fields.Description : '';
      img.src = pokemon.fields.Sprites[0].url;
      hp.innerHTML = `HP: ${pokemon.fields.HP}`;
      hp.classList = 'hp';
      // Gets type and adds class to li element with type
      pokemon.fields.Types.forEach(function(type) {
        const filteredType = typesArray.filter(record => type == record.id);
        // if Name exists in filtered array
        if (filteredType[0] && filteredType[0].Name) {
          el.classList.add(`type-${filteredType[0].Name.toLowerCase()}`)
        }
      });
      // append them to the list
      pokelist.append(el);
      el.append(img, h1, p, hp);
   }
  });
}

function gotPageOfTypes(records, fetchNextPage) {
  // add the records from this page to our pokemon array
  // typesArray.push(...records);
  records.forEach(function(type) {
    typesArray.push({id: type.id, ...type.fields});
  });
  // request more pages
  fetchNextPage();
}

function gotAllTypes(err) {
  // checks for errors
  try {
    showTypes();
  } catch (error) {
    error.log(error);
  }
}

function showTypes() {
  // once we have all the types, make sure our typeList exists
  if (typeList) {
    typesArray.forEach(function(type) {
      // create list item
      const el = document.createElement('li');
      // makes sure we have the type name and sets the data attribute of the li
      el.dataset.filter = type.Name ? `type-${type.Name.toLowerCase()}` : '';
      el.innerHTML = type.Name ? type.Name : '';
      typeList.append(el);
    })
  }

  // set up filters once we've appended them to the document
  const typeFilters = typeList.querySelectorAll('li');

  typeFilters.forEach(function(typeFilter) {
    // add click listener
    typeFilter.addEventListener('click', function(e) {
      e.preventDefault();
      // removes class from all filters
      typeFilters.forEach(function(filter) {
        filter.classList.remove('is-active');
      });
      // adds class to clicked filter
      e.target.classList.add('is-active');

      // this section grabs all the pokemon cards
      const pokemonCards = document.querySelectorAll('.pokemon-card');
      // triple check we actually have cards
      if (pokemonCards.length > 0) {
        pokemonCards.forEach(function(card) {
          // gets the data-filter attribute from the clicked element, and checks each pokemon to see if the card has the relevant class, if it doesn't have the class, we hide the card with .is-hidden
          if (!card.classList.contains(e.target.dataset.filter)) {
            card.classList.add('is-hidden');
          } else {
            card.classList.remove('is-hidden');
          }
        });
      }
    });
  });
}