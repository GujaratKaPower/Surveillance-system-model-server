const express = require('express');
const app = express();

const cors = require('cors');
const http = require('http').createServer(app);

// initialize cors
app.use(cors());

app.use(express.static("models"))

http.listen(process.env.PORT || 8000, () => {
  console.log("server has started")
})