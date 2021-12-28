const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Sessions',
  {
    useNewUrlParser: true,
    // useUnifiedTopology: true
  }
).then(()=>console.log("connection established"))
.catch((error)=>console.log(error));
