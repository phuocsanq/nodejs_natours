document.addEventListener('DOMContentLoaded', function () {  
    const locationsData = JSON.parse(document.querySelector('#map').getAttribute('data-locations'));
    // create map
    const map = L.map('map', { minZoom: 2 }).setView([0, 0], 1);
 
    // https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    locationsData.forEach(location => {
      const latitude = location.coordinates[1];
      const longitude = location.coordinates[0];
      const day = location.day;
      const description = location.description;
      const name = locationsData.length === 1 ? description : `Day ${day}: ${description}`;
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindTooltip(name).openTooltip(); 
    });

    // view all location
    const group = new L.featureGroup(locationsData.map(location => L.marker([location.coordinates[1], location.coordinates[0]])));
    map.fitBounds(group.getBounds().pad(0.2));
    map.panBy([0, -10]);    
});