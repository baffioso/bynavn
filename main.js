const suffix = [
  { name: '*rup', suffix: 'rup', color: 'red' },
  { name: '*by', suffix: 'by', color: 'green' },
  { name: '*huse', suffix: 'huse', color: 'blue' },
  { name: '*sted', suffix: 'sted', color: 'orange' },
  { name: '*lev', suffix: 'lev', color: 'yellow' },
  { name: '*skov', suffix: 'skov', color: 'greenyellow' },
  { name: '*høj', suffix: 'høj', color: 'tomato' },
  { name: '*rød', suffix: 'rød', color: 'aqua' },
  { name: '*borg', suffix: 'borg', color: 'palegoldenrod' },
  { name: '*holm', suffix: 'holm', color: 'sienna' },
  { name: '*bæk', suffix: 'bæk', color: 'peachpuff' },
  { name: '*bro', suffix: 'bro', color: 'darkturquoise' },
  { name: '*lund', suffix: 'lund', color: 'darkkhaki' },
  { name: '*løse', suffix: 'løse', color: 'mistyrose' },
  { name: '*sø', suffix: 'sø', color: 'darksalmon' },
];

let selectedSuffixes = suffix.map((i) => i.suffix);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYmFmZmlvc28iLCJhIjoiY2s5cmN6ejBvMHN5OTNnbWVxcDVobmZ2bCJ9.hEIms6er4x8Jwg6LfM4tSg';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [11, 55.5], // starting position [lng, lat]
  zoom: 5, // starting zoom
});

map.on('load', () => {
  // create layercontrol
  for (const i of suffix) {
    createCheckbox(i.name, i.suffix, i.color);
  }

  map.addLayer({
    id: 'byer',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'data/bynavneendelser.geojson',
    },
    layout: {},
    paint: {
      'circle-radius': 2,
      'circle-color': circleColor(suffix),
      'circle-opacity': 0.7,
    },
  });
});

const toggelSelectAll = () => {
  let el = document.getElementById('select-all');
  let checkboxes = document.querySelectorAll('input[name="legend"]');

  if (el.checked) {
    for (var checkbox of checkboxes) {
      checkbox.checked = true;
      selectedSuffixes = suffix.map((i) => i.suffix);
      map.setFilter('byer', filterBySuffix(selectedSuffixes));
    }
  } else {
    for (var checkbox of checkboxes) {
      checkbox.checked = false;
      selectedSuffixes = [];
      map.setFilter('byer', filterBySuffix(selectedSuffixes));
    }
  }
};

const createCheckbox = (name, suffix, color) => {
  // create the necessary elements
  var label = document.createElement('label');
  var description = document.createTextNode(name);
  var checkbox = document.createElement('input');

  checkbox.type = 'checkbox'; // make the element a checkbox
  checkbox.name = 'legend';
  checkbox.value = suffix;
  checkbox.checked = true;

  // Add eventlisteners
  checkbox.addEventListener('change', function (e) {
    const suf = e.target.value;

    if (this.checked) {
      selectedSuffixes.push(suf);
      map.setFilter('byer', filterBySuffix(selectedSuffixes));
    } else {
      selectedSuffixes.splice(selectedSuffixes.indexOf(suf), 1);
      map.setFilter('byer', filterBySuffix(selectedSuffixes));
    }
  });

  checkbox.addEventListener('mouseenter', function (e) {
    const suf = e.target.value;
    map.setPaintProperty('byer', 'circle-radius', [
      'match',
      ['get', 'suffix'],
      suf,
      5,
      2,
    ]);
    map.setPaintProperty('byer', 'circle-opacity', [
      'match',
      ['get', 'suffix'],
      suf,
      1,
      0.2,
    ]);
  });

  checkbox.addEventListener('mouseleave', function (e) {
    const suf = e.target.value;
    map.setPaintProperty('byer', 'circle-radius', 2);
    map.setPaintProperty('byer', 'circle-opacity', 0.7);
  });

  label.appendChild(checkbox); // add the box to the element
  label.appendChild(description); // add the description to the element

  // add the label element to the div
  document.getElementById('suffix').appendChild(label).style.color = color;
};

const circleColor = (data) => {
  // create mapbox style expression for markers
  let style = data.reduce(
    (prev, curr) => {
      prev.push(curr.suffix, curr.color);
      return prev;
    },
    ['match', ['get', 'suffix']]
  );

  // default color
  style.push('grey');

  return style;
};

const filterFeatures = () => {
  let input = document.getElementById('search-input').value;
  if (input.length > 0) {
    console.log(input);
    map.setFilter('byer', [
      'in',
      input.toUpperCase(),
      ['upcase', ['get', 'navn']],
    ]);
  } else {
    map.setFilter('byer', null);
  }
};

const filterBySuffix = (suffixes) => {
  return ['in', 'suffix'].concat(suffixes);
};
