const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const tf = require("@tensorflow/tfjs-node");
const { models } = require("@tensorflow/tfjs-node");
const cors = require('cors')
const modelName = "another-model"
const classes = require(`./models/${modelName}/metadata.json`);
const labels = classes.labels;
console.log(labels)

// setup body parser
app.use(bodyParser.json({ limit: "15MB" }));
app.use(cors())



async function loadModel() {
  const model = await tf.loadLayersModel(`file://models/${modelName}/model.json`);
  return model;
}

async function runServer() {
  const model = await loadModel();

  app.get("/", (req, res) => {
    
    res.send({
      "msg":"Test complete"
    })
  })

  app.post("/post/image/", (req, res) => {

    console.log("Detection Request.")
    const json = req.body;
    let result = tf.tidy(() => {
      const buffer = Buffer.from(json.data, 'base64');
      const imageTensor = tf.node.decodeImage(new Uint8Array(buffer)).resizeNearestNeighbor([224, 224]).expandDims()
      const preds = model.predict(imageTensor).dataSync()
      const bestPrd = labels[tf.argMax(preds).dataSync()[0]]
      console.log(preds)
      return bestPrd;
    })
    console.log(result)
    res.json({
      intensity: result
    })
  })
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server started")
  })
}

// endpoints
runServer();
