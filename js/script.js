var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyLBiQM3uhxBV6DM'}).base('appbhEpIibUEAmBpd');

let pokelist = document.getElementById('pokemon-list');

base('Pokémon').select({
   maxRecords: 48,
   view: "All"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
      if (pokelist) {
         // define and create elements
         let el = document.createElement('li');
         let p = document.createElement('p');
         let h1 = document.createElement('h1');
         let img = document.createElement('img');
         let hp = document.createElement('div');
         // Set innerHTML of the elements
         h1.innerHTML = record.get('Name');
         p.innerHTML = record.get('Description');
         img.src = record.fields.Sprites[0].url;
         hp.innerHTML = `HP: ${record.get('HP')}`;
         hp.classList = 'hp';
         // append them to the list
         pokelist.append(el);
         el.append(img, h1, p, hp);
         el.classList.add('animate');
      }
    });

    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});