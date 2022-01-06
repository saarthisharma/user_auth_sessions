const address = require('address');

address(function (err, ad) {
  if(err)
  {
    console.log(err)
  }
  else
  {
    console.log(ad.mac);

  }
});
  