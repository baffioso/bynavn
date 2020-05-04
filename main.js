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

styles = {
  opacity: ['case', ['==', null, ['get', 'suffix']], 0, 0.7],
  radius: ['interpolate', ['linear'], ['zoom'], 8, 2, 11, 15],
};

mapboxgl.accessToken =
  'pk.eyJ1IjoiYmFmZmlvc28iLCJhIjoiY2s5cmN6ejBvMHN5OTNnbWVxcDVobmZ2bCJ9.hEIms6er4x8Jwg6LfM4tSg';

let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [11, 55.5], // starting position [lng, lat]
  zoom: 5, // starting zoom
  hash: true,
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
      'circle-radius': styles.radius,
      'circle-color': circleColor(suffix),
      'circle-opacity': styles.opacity,
    },
  });

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on('mouseenter', 'byer', function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.navn;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on('mouseleave', 'byer', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
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
    map.setPaintProperty('byer', 'circle-radius', styles.radius);
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
    map.setPaintProperty('byer', 'circle-radius', styles.radius);
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
  style.push('lightgray');

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
    map.setPaintProperty('byer', 'circle-opacity', 0.7);
  } else {
    map.setFilter('byer', null);
    map.setPaintProperty('byer', 'circle-opacity', [
      'case',
      ['==', null, ['get', 'suffix']],
      0,
      0.7,
    ]);
  }
};

const filterBySuffix = (suffixes) => {
  return ['in', 'suffix'].concat(suffixes);
};
