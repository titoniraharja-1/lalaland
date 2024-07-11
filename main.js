// Mendefinisikan titik awal dan zoom peta
var map = L.map('map').setView([-6.99683574959636, 110.347209759056994], 17);

// Mendefinisikan basemap yang akan digunakan
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var osmTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy; <a href="https://www.google.com/earth/">Google</a>'
});
var googleStreet = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: 'Map data &copy; <a href="https://www.google.com/earth/">Google</a>'
});

// Menambahkan OSM sebagai basemap awal
osm.addTo(map);

// Mendefinisikan icon custom untuk search location
var iconPinpoint = L.divIcon({
  html: '<i class="fa-solid fa-thumbtack custom-pin"></i>',
  className: 'icon-pinpoint'
});

// Mendefinisikan dan mengatur Leaflet Search Location (Geocoder)
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
}).on('markgeocode', function(e) {
  var latlng = e.geocode.center;

  if (typeof marker !== 'undefined') {
    map.removeLayer(marker);
  }

  marker = L.marker(latlng, { icon: iconPinpoint }).addTo(map)
    .bindPopup(e.geocode.name)
    .openPopup();

  map.setView(latlng, map.getZoom());
}).addTo(map);

// Fungsi untuk mengatur ulang peta ke lokasi default awal
function resetMap() {
  map.setView([-6.99683574959636, 110.347209759056994], 17);
}

// Kontrol legenda
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<img src="./assets/image/legendbatas.png" alt="Item 1"> <span>Batas Zona</span><br>';
    div.innerHTML += '<img src="./assets/image/legendkantorkec.png" alt="Item 2"> <span>Kantor Kecamatan Ngaliyan</span><br>';
    div.innerHTML += '<img src="./assets/image/legendpasar.png" alt="Item 3"> <span>Pasar Ngaliyan</span><br>';
    div.innerHTML += '<img src="./assets/image/legendrs.png" alt="Item 2"> <span>Rumah Sakit Permata Medika</span><br>';
    div.innerHTML += '<img src="./assets/image/legendsmpn.png" alt="Item 3"> <span>SMPN 16 Semarang</span><br>';
    div.innerHTML += '<img src="./assets/image/legenduin.png" alt="Item 2"> <span>UIN Walisongo Semarang</span><br>';
    return div;
};
legend.addTo(map);

// Mendefinisikan icon custom untuk variabel
var iconBuildingColumns = L.divIcon({
  className: 'icon-building-columns',
  html: '<i class="fa-solid fa-building-columns"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
var iconShop = L.divIcon({
  className: 'icon-shop',
  html: '<i class="fa-solid fa-shop"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
var iconHospital = L.divIcon({
  className: 'icon-hospital',
  html: '<i class="fa-solid fa-hospital"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
var iconSchool = L.divIcon({
  className: 'icon-school',
  html: '<i class="fa-solid fa-school"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
var iconBuilding = L.divIcon({
  className: 'icon-building',
  html: '<i class="fa-solid fa-building"></i>', 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Menambahkan GeoJSON layer ke peta
var variabel = L.geoJSON(variabeldata, {
  pointToLayer: function (feature, latlng) {
      var icon;
      switch (feature.properties.Name) {
          case 'Kantor Kecamatan Ngaliyan':
              icon = iconBuildingColumns;
              break;
          case 'Pasar Ngaliyan':
              icon = iconShop;
              break;
          case 'Rumah Sakit Permata Medika':
              icon = iconHospital;
              break;
          case 'SMPN 16 Semarang':
              icon = iconSchool;
              break;
          case 'UIN Walisongo Semarang':
              icon = iconBuilding;
              break;
      }
      return L.marker(latlng, { icon: icon });
  },
  onEachFeature: function (feature, layer) {
      // Bubble pop up untuk variabel
      layer.bindPopup(`<strong>${feature.properties.Name}</strong><br>${feature.properties.Address}`);
  }
});
var enambelas = L.geoJSON(enambelasdata, {
  style: function() {
    return {
      color: '#414CCA',          // Warna garis tepi polygon
      fillColor: '#414CCA',      // Warna isi polygon
      fillOpacity: 0.1,       // Transparansi isi polygon
      weight: 2               // Ketebalan garis tepi polygon
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});
var sembilanbelas = L.geoJSON(sembilanbelasdata, {
  style: function() {
    return {
      color: '#414CCA',
      fillColor: '#414CCA',
      fillOpacity: 0.1,
      weight: 2
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});
var duadua = L.geoJSON(duaduadata, {
  style: function() {
    return {
      color: '#414CCA',
      fillColor: '#414CCA',
      fillOpacity: 0.1,
      weight: 2
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});
var duaempat = L.geoJSON(duaempatdata, {
  style: function() {
    return {
      color: '#414CCA',
      fillColor: '#414CCA',
      fillOpacity: 0.1,
      weight: 2
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});
var dualima = L.geoJSON(dualimadata, {
  style: function() {
    return {
      color: '#414CCA',
      fillColor: '#414CCA',
      fillOpacity: 0.1,
      weight: 2
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});
var dualapan = L.geoJSON(dualapandata, {
  style: function() {
    return {
      color: '#414CCA',
      fillColor: '#414CCA',
      fillOpacity: 0.1,
      weight: 2
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});
var tigasatu = L.geoJSON(tigasatudata, {
  style: function() {
    return {
      color: '#414CCA',
      fillColor: '#414CCA',
      fillOpacity: 0.1,
      weight: 2
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
      <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
      <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
      <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
      <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
      <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
      <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
    );
    layer.bindTooltip(feature.properties.VALUERP, {
      permanent: true,
      direction: 'center',
      className: 'label-tooltip'
    });
  }
});

variabel.addTo(map);
duaempat.addTo(map); // Menjadikan SHP 2024 menjadi shp awal yang ditampilkan

// Event listener untuk checkbox
document.getElementById('layerVariabel').addEventListener('change', function() {
  if (this.checked) {
    variabel.addTo(map);
  } else {
    map.removeLayer(variabel);
  }
});

// Mengatur radio button shp awal yang ditampilkan
document.getElementById('layerDuaempat').checked = true;

// Event listener untuk radio buttons
document.querySelectorAll('input[name="layer"]').forEach(function(radioButton) {
  radioButton.addEventListener('change', function() {
    // Menghapus semua layer selain variabel
    [enambelas, sembilanbelas, duadua, duaempat, dualima, dualapan, tigasatu].forEach(function(layer) {
      map.removeLayer(layer);
    });

    // Menampilkan layer yang dipilih sesuai radio buttons
    if (this.checked) {
      switch (this.value) {
        case 'enambelas':
          enambelas.addTo(map);
          break;
        case 'sembilanbelas':
          sembilanbelas.addTo(map);
          break;
        case 'duadua':
          duadua.addTo(map);
          break;
        case 'duaempat':
          duaempat.addTo(map);
          break;
        case 'dualima':
          dualima.addTo(map);
          break;
        case 'dualapan':
          dualapan.addTo(map);
          break;
        case 'tigasatu':
          tigasatu.addTo(map);
          break;
      }
    }
  });
});

// Mendefinisikan variabel untuk layer setelah dilakukannya filter
var filteredEnambelasLayer = null;
var filteredSembilanbelasLayer = null;
var filteredDuaduaLayer = null;
var filteredDuaempatLayer = null;
var filteredDualimaLayer = null;
var filteredDualapanLayer = null;
var filteredTigasatuLayer = null;

// Fungsi untuk menerapkan banyak filter sekaligus
function applyFilters() {
  const nilaiBaruLimit = document.getElementById('nilaiBaruFilter').value;
  const distanceLimit = document.getElementById('distanceFilter').value;
  const distanceHOLimit = document.getElementById('distanceHOFilter').value;
  const distanceMALimit = document.getElementById('distanceMAFilter').value;
  const distanceGOLimit = document.getElementById('distanceGOFilter').value;
  const distanceUNLimit = document.getElementById('distanceUNFilter').value;

  // Mengonversi input string menjadi float, kalau kosong menjadi null
  const nilaiMax = nilaiBaruLimit !== '' ? parseFloat(nilaiBaruLimit) : null;
  const jarakMax = distanceLimit !== '' ? parseFloat(distanceLimit) : null;
  const jarakHOMax = distanceHOLimit !== '' ? parseFloat(distanceHOLimit) : null;
  const jarakMAMax = distanceMALimit !== '' ? parseFloat(distanceMALimit) : null;
  const jarakGOMax = distanceGOLimit !== '' ? parseFloat(distanceGOLimit) : null;
  const jarakUNMax = distanceUNLimit !== '' ? parseFloat(distanceUNLimit) : null;

  console.log("Applying filters with Nilai Tanah: ", nilaiMax, 
              "Distance: ", jarakMax, 
              "Healthcare Distance: ", jarakHOMax,
              "Market Distance: ", jarakMAMax,
              "Government Office Distance: ", jarakGOMax,
              "University Distance: ", jarakUNMax);

  // Menampilkan notifikasi jika tidak mengisi kriteria tetapi melakukan klik pada terapkan filter
  if (nilaiMax === null && jarakMax === null && jarakHOMax === null && jarakMAMax === null && jarakGOMax === null && jarakUNMax === null) {
    alert('Harap masukkan setidaknya satu kriteria filter.');
    return;
  }

  // Menentukan layer mana yang saat ini aktif
  let activeLayer = null;
  if (document.getElementById('layerEnambelas').checked) {
    activeLayer = enambelas;
  } else if (document.getElementById('layerSembilanbelas').checked) {
    activeLayer = sembilanbelas;
  } else if (document.getElementById('layerDuadua').checked) {
    activeLayer = duadua;
  } else if (document.getElementById('layerDuaempat').checked) {
    activeLayer = duaempat;
  } else if (document.getElementById('layerDualima').checked) {
    activeLayer = dualima;
  } else if (document.getElementById('layerDualapan').checked) {
    activeLayer = dualapan;
  } else if (document.getElementById('layerTigasatu').checked) {
    activeLayer = tigasatu;
  }

  // Melakukan filter layer yang aktif berdasarkan atribut yang dikehendaki
  updateLayer(activeLayer, activeLayer.getGeoJSONData(), nilaiMax, jarakMax, jarakHOMax, jarakMAMax, jarakGOMax, jarakUNMax);
}

// Mendefinisikan metode untuk mendapat GeoJSON data untuk setiap layer
enambelas.getGeoJSONData = function() { return enambelasdata; }
sembilanbelas.getGeoJSONData = function() { return sembilanbelasdata; }
duadua.getGeoJSONData = function() { return duaduadata; }
duaempat.getGeoJSONData = function() { return duaempatdata; }
dualima.getGeoJSONData = function() { return dualimadata; }
dualapan.getGeoJSONData = function() { return dualapandata; }
tigasatu.getGeoJSONData = function() { return tigasatudata; }

// Fungsi untuk melakukan update pada GeoJSON layer berdasarkan filters
function updateLayer(layer, data, nilaiBaruLimit, distanceLimit, distanceHOLimit, distanceMALimit, distanceGOLimit, distanceUNLimit) {
  // Menghapus layer yang saat ini aktif di peta
  if (map.hasLayer(layer)) {
    map.removeLayer(layer);
  }

  // Menghapus layer terfilter yang ada di peta jika ada
  if (filteredEnambelasLayer && map.hasLayer(filteredEnambelasLayer)) {
    map.removeLayer(filteredEnambelasLayer);
  }
  if (filteredSembilanbelasLayer && map.hasLayer(filteredSembilanbelasLayer)) {
    map.removeLayer(filteredSembilanbelasLayer);
  }
  if (filteredDuaduaLayer && map.hasLayer(filteredDuaduaLayer)) {
    map.removeLayer(filteredDuaduaLayer);
  }
  if (filteredDuaempatLayer && map.hasLayer(filteredDuaempatLayer)) {
    map.removeLayer(filteredDuaempatLayer);
  }
  if (filteredDualimaLayer && map.hasLayer(filteredDualimaLayer)) {
    map.removeLayer(filteredDualimaLayer);
  }
  if (filteredDualapanLayer && map.hasLayer(filteredDualapanLayer)) {
    map.removeLayer(filteredDualapanLayer);
  }
  if (filteredTigasatuLayer && map.hasLayer(filteredTigasatuLayer)) {
    map.removeLayer(filteredTigasatuLayer);
  }

  // Melakukan filter pada data GeoJSON berdasarkan atribut
  const filteredData = data.features.filter(function(feature) {
    const nilaiBaru = feature.properties.VALUEZONE;
    const jarak = feature.properties.DISTANCESC;
    const jarakHO = feature.properties.DISTANCEHO;
    const jarakMA = feature.properties.DISTANCEMA;
    const jarakGO = feature.properties.DISTANCEGO;
    const jarakUN = feature.properties.DISTANCEUN;

    // Melakukan validasi filter
    let passFilter = true;

    if (nilaiBaruLimit !== null) {
      passFilter = passFilter && (nilaiBaru <= nilaiBaruLimit);
    }

    if (distanceLimit !== null) {
      passFilter = passFilter && (jarak <= distanceLimit);
    }

    if (distanceHOLimit !== null) {
      passFilter = passFilter && (jarakHO <= distanceHOLimit);
    }

    if (distanceMALimit !== null) {
      passFilter = passFilter && (jarakMA <= distanceMALimit);
    }

    if (distanceGOLimit !== null) {
      passFilter = passFilter && (jarakGO <= distanceGOLimit);
    }

    if (distanceUNLimit !== null) {
      passFilter = passFilter && (jarakUN <= distanceUNLimit);
    }

    return passFilter;
  });

  console.log("Filtered Data: ", filteredData);

  // Memunculkan notifikasi jika tidak ada data yang sesuai dengan kriteria filter
  if (filteredData.length === 0) {
    alert('Tidak terdapat data yang sesuai dengan kriteria filter.');
    return;
  }

  // Membuat GeoJSON layer baru dengan data terfilter
  const filteredLayer = L.geoJSON({
    type: 'FeatureCollection',
    features: filteredData
  }, {
    style: function() {
      return {
        color: '#414CCA',
        fillColor: '#414CCA',
        fillOpacity: 0.1,
        weight: 2
      };
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        `<b>Nomor Zona:</b> ${feature.properties.NOZONE}<br>
        <b>Nilai Tanah:</b> ${feature.properties.VALUERP}<br>
        <b>Jarak ke SMPN 16:</b> ${feature.properties.DISTANCESC} meter<br>
        <b>Jarak ke Rumah Sakit Permata Medika:</b> ${feature.properties.DISTANCEHO} meter<br>
        <b>Jarak ke Pasar Ngaliyan:</b> ${feature.properties.DISTANCEMA} meter<br>
        <b>Jarak ke Kantor Kecamatan Ngaliyan:</b> ${feature.properties.DISTANCEGO} meter<br>
        <b>Jarak ke UIN Walisongo:</b> ${feature.properties.DISTANCEUN} meter`
      );
      layer.bindTooltip(feature.properties.VALUERP, {
        permanent: true,
        direction: 'center',
        className: 'label-tooltip'
      });
    }
  });

  // Menambahkan layer terfilter ke peta, dan melakukan update variabel
  if (layer === enambelas) {
    filteredEnambelasLayer = filteredLayer;
  } else if (layer === sembilanbelas) {
    filteredSembilanbelasLayer = filteredLayer;
  } else if (layer === duadua) {
    filteredDuaduaLayer = filteredLayer;
  } else if (layer === duaempat) {
    filteredDuaempatLayer = filteredLayer; 
  } else if (layer === dualima) {
    filteredDualimaLayer = filteredLayer;
  } else if (layer === dualapan) {
    filteredDualapanLayer = filteredLayer;
  } else if (layer === tigasatu) {
    filteredTigasatuLayer = filteredLayer;
  }

  filteredLayer.addTo(map);
}

// Fungsi untuk mereset filter dan menghapus layer terfilter
function resetFilters() {
  // Menghapus kolom isi filter
  document.getElementById('nilaiBaruFilter').value = '';
  document.getElementById('distanceFilter').value = '';
  document.getElementById('distanceHOFilter').value = '';
  document.getElementById('distanceMAFilter').value = '';
  document.getElementById('distanceGOFilter').value = '';
  document.getElementById('distanceUNFilter').value = '';

  // Menghapus semua layer terfilter jika ada
  if (filteredEnambelasLayer && map.hasLayer(filteredEnambelasLayer)) {
    map.removeLayer(filteredEnambelasLayer);
    filteredEnambelasLayer = null;
  }
  if (filteredSembilanbelasLayer && map.hasLayer(filteredSembilanbelasLayer)) {
    map.removeLayer(filteredSembilanbelasLayer);
    filteredSembilanbelasLayer = null;
  }
  if (filteredDuaduaLayer && map.hasLayer(filteredDuaduaLayer)) {
    map.removeLayer(filteredDuaduaLayer);
    filteredDuaduaLayer = null;
  }
  if (filteredDuaempatLayer && map.hasLayer(filteredDuaempatLayer)) {
    map.removeLayer(filteredDuaempatLayer);
    filteredDuaempatLayer = null;
  }
  if (filteredDualimaLayer && map.hasLayer(filteredDualimaLayer)) {
    map.removeLayer(filteredDualimaLayer);
    filteredDualimaLayer = null;
  }
  if (filteredDualapanLayer && map.hasLayer(filteredDualapanLayer)) {
    map.removeLayer(filteredDualapanLayer);
    filteredDualapanLayer = null;
  }
  if (filteredTigasatuLayer && map.hasLayer(filteredTigasatuLayer)) {
    map.removeLayer(filteredTigasatuLayer);
    filteredTigasatuLayer = null;
  }

  // Menambahkan kembali data GeoJSON awal (asli)
  if (document.getElementById('layerEnambelas').checked) {
    enambelas.addTo(map);
  }
  if (document.getElementById('layerSembilanbelas').checked) {
    sembilanbelas.addTo(map);
  }
  if (document.getElementById('layerDuadua').checked) {
    duadua.addTo(map);
  }
  if (document.getElementById('layerDuaempat').checked) {
    duaempat.addTo(map);
  }
  if (document.getElementById('layerDualima').checked) {
    dualima.addTo(map);
  }
  if (document.getElementById('layerDualapan').checked) {
    dualapan.addTo(map);
  }
  if (document.getElementById('layerTigasatu').checked) {
    tigasatu.addTo(map);
  }
}

// Menambah event listener untuk reset filter button
document.getElementById('resetfilterButton').addEventListener('click', resetFilters);

// Fungsi untuk menampilkan atau menyembunyikan popup saat tombol diklik
document.getElementById('showPopup1').addEventListener('click', function() {
    var popup = document.getElementById('popup1');
    if (popup.style.display === "none") {
    popup.style.display = "block";
    } else {
    popup.style.display = "none";
    }
});

function togglePopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup.style.display === "none") {
      popup.style.display = "block";
    } else {
      popup.style.display = "none";
    }
}

document.getElementById('showPopup2').addEventListener('click', function() {
    var popup = document.getElementById('popup2');
    if (popup.style.display === "none") {
    popup.style.display = "block";
    } else {
    popup.style.display = "none";
    }
});

document.getElementById('showPopup3').addEventListener('click', function() {
    var popup = document.getElementById('popup3');
    if (popup.style.display === "none") {
    popup.style.display = "block";
    } else {
    popup.style.display = "none";
    }
});

// Fungsi untuk menampilkan basemap
function changeBasemap(basemap) {
    // Hapus semua lapisan basemap yang ada dari peta
    map.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    // Menambahkan lapisan basemap baru sesuai pilihan pengguna
    if (basemap === 'OpenStreetMap') {
        osm.addTo(map);
    } else if (basemap === 'OpenStreetMapTopo') {
        osmTopo.addTo(map);
    } else if (basemap === 'Google Satellite') {
        googleSat.addTo(map);
    } else if (basemap === 'Google Street') {
        googleStreet.addTo(map);
    }
}

// Fungsi untuk menampilkan atau menyembunyikan popup info
function toggleInfoPopup() {
  var popup = document.getElementById('infoPopup');
  if (popup.classList.contains('show')) {
    popup.classList.remove('show');
  } else {
    popup.classList.add('show');
  }
}
  
// Menambahkan event listener untuk tombol di footer
document.getElementById('footerButton').addEventListener('click', toggleInfoPopup);
