import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = 'fakekey';

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS'
}

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios.get<GoogleGeocodingResponse>(`https://maps.google.com/maps/fake/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(response => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 8
      });

      new google.maps.Marker({ position: coordinates, map });
    })
    .catch(err => {
      alert(err.message);
      console.log(err);
    })
}

form.addEventListener('submit', searchAddressHandler);