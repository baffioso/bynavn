const suffix = [
  { name: '*rup', suffix: 'rup', color: 'red' },
  { name: '*by', suffix: 'by', color: 'green' },
  { name: '*huse', suffix: 'huse', color: 'rgb(139, 0, 0)' },
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

// detect if it is mobile
const mobile = isMobile.any;

styles = {
  opacity: ['case', ['==', null, ['get', 'suffix']], 0, 0.7],
  radius: ['interpolate', ['linear'], ['zoom'], 7, 2, 11, 15],
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
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

  // create layercontrol
  for (const i of suffix) {
    createCheckbox(i.name, i.suffix, i.color);
  }

  map.addSource('byer', {
    type: 'geojson',
    data: 'data/bynavneendelser.geojson',
  });

  map.addLayer({
    id: 'byer',
    type: 'circle',
    source: 'byer',
    layout: {},
    paint: {
      'circle-radius': styles.radius,
      'circle-color': circleColor(suffix),
      'circle-opacity': styles.opacity,
    },
  });

  createPopup();
});

const createPopup = () => {
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
};

const toggelSelectAll = () => {
  let el = document.getElementById('select-all');
  let checkboxes = document.querySelectorAll('input[name="legend"]');

  if (el.checked) {
    for (var checkbox of checkboxes) {
      checkbox.checked = true;
      selectedSuffixes = suffix.map((i) => i.suffix);
      map.setFilter('byer', ['in', 'suffix'].concat(selectedSuffixes));
    }
  } else {
    for (var checkbox of checkboxes) {
      checkbox.checked = false;
      selectedSuffixes = [];
      map.setFilter('byer', ['in', 'suffix'].concat(selectedSuffixes));
    }
  }
};

const createCheckbox = (name, suffix, color) => {
  // create the necessary elements
  var label = document.createElement('label');
  var description = document.createTextNode(name);
  var checkbox = document.createElement('input');

  label.id = suffix;

  checkbox.type = 'checkbox'; // make the element a checkbox
  checkbox.name = 'legend';
  checkbox.value = suffix;
  checkbox.checked = true;

  // Add eventlisteners
  checkbox.addEventListener('change', function (e) {
    const suf = e.target.value;

    if (this.checked) {
      selectedSuffixes.push(suf);
      map.setFilter('byer', ['in', 'suffix'].concat(selectedSuffixes));
    } else {
      selectedSuffixes.splice(selectedSuffixes.indexOf(suf), 1);
      map.setFilter('byer', ['in', 'suffix'].concat(selectedSuffixes));
    }
  });

  // Only add hover effect on desktop
  if (!mobile) {
    label.addEventListener('mouseenter', function (e) {
      const suffix = e.target.id;
      highlightFeatures(suffix);
    });

    label.addEventListener('mouseleave', function () {
      map.setPaintProperty('byer', 'circle-radius', styles.radius);
      map.setPaintProperty('byer', 'circle-opacity', styles.opacity);
    });
  }

  label.appendChild(checkbox); // add the box to the element
  label.appendChild(description); // add the description to the element

  // add the label element to the div
  document.getElementById('suffix').appendChild(label).style.color = color;
};

const highlightFeatures = (suffix) => {
  map.setPaintProperty('byer', 'circle-radius', [
    'match',
    ['get', 'suffix'],
    suffix,
    5,
    2,
  ]);
  map.setPaintProperty('byer', 'circle-opacity', [
    'match',
    ['get', 'suffix'],
    suffix,
    1,
    0.1,
  ]);
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
    // Filter features and apply single style
    const filter = ['in', input.toUpperCase(), ['upcase', ['get', 'navn']]];
    map.setFilter('byer', filter);
    map.setPaintProperty('byer', 'circle-opacity', 0.8);
    map.setPaintProperty('byer', 'circle-color', 'rgb(53, 175, 109)');

    // Add labels (if not exists)
    if (!map.getLayer('byer-label')) {
      map.addLayer({
        id: 'byer-label',
        type: 'symbol',
        source: 'byer',
        layout: {
          'text-field': ['get', 'navn'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          // 'text-transform': 'uppercase',
          'text-letter-spacing': 0.05,
          'text-offset': [0, -1.5],
        },
        paint: {
          'text-color': 'white',
        },
      });
    }

    // Filter labels
    map.setFilter('byer-label', filter);

    // Feature count
    const feat = map.querySourceFeatures('byer', { filter: filter });
    const unique = getUniqueFeatures(feat, 'id');
    document.getElementById('hits').innerHTML = '(' + unique.length + ')';
  } else {
    // Back to default styling
    map.removeLayer('byer-label');
    map.setFilter('byer', ['in', 'suffix'].concat(selectedSuffixes));
    map.setPaintProperty('byer', 'circle-color', circleColor(suffix));
    map.setPaintProperty('byer', 'circle-opacity', [
      'case',
      ['==', null, ['get', 'suffix']],
      0,
      0.7,
    ]);
    document.getElementById('hits').innerHTML = '';
  }
};

const getUniqueFeatures = (array, comparatorProperty) => {
  var existingFeatureKeys = {};
  // Because features come from tiled vector data, feature geometries may be split
  // or duplicated across tile boundaries and, as a result, features may appear
  // multiple times in query results.
  var uniqueFeatures = array.filter(function (el) {
    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
      return false;
    } else {
      existingFeatureKeys[el.properties[comparatorProperty]] = true;
      return true;
    }
  });

  return uniqueFeatures;
};
