const findlocation = () =>{
  const status = document.querySelector('.status');
  const success = (position) =>{
    console.log(position)
    const latitude = position.coords.latitude; 
    const longitude = position.coords.longitude;
    console.log(latitude + ' ' +longitude);

    // lat and longitude called geocodes
    // to reverse the geocode to get the location name , we need an api to reverse it
    const geoapi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`

    // we have to fetch from the url
    // fetch is a method , returns the data in json / xml , returns a promise 
    fetch(geoapi)
    .then(res => res.json())
    .then(data =>{
      console.log(data)
      console.log(data.localityInfo.administrative);
    })
  }
  const error = () =>{
    status.textContent = "no location"
  }
  navigator.geolocation.getCurrentPosition(success , error);
}
document.querySelector('.find-state').addEventListener('click' , findlocation);