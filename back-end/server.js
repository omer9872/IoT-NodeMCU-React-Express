
// Import Dependicies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment')

// Import MongoDB Schemas from schemas.js file
const {
  circuitModel,
  circuitDataModel
} = require('./schemas');

// mongodb connection
mongoose.connect('<mongodb_connection_string>', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
}, (err) => {
  if (err) throw err;
  else console.log('Connected To DB Successfully.');
});

// contruction of express server
const app = express();

// app configurations
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// get requests which returns 'Hello from EC2!'
app.get('/api', (req, res) => {
  res.send('Hello from EC2!');
});

// get requests which returns total amount of 'circuitData' in database
app.get('/api/totaldata', (req, res) => {
  circuitDataModel.find({}, (err, docs) => {
    if (err)
      res.status(400).json({ result: "Error occured while fetching data!" });
    else
      res.status(200).json({ dataAmount: docs.length });
  })
});

// get requests which returns circuit datas according to given key
app.get('/api/circuit', (req, res) => {
  const { key } = req.query;
  console.log(req.query);
  if (key) {
    circuitModel.find({ key: key }, (err, docs) => {
      if (err) throw err;
      if (docs.length !== 0)
        res.status(200).json(docs);
      else
        res.status(404).json({ result: 'Data not found!' })
    })
  } else {
    res.status(404).json({ result: 'Key is not defined!' })
  }
});

// get requests which returns all of the dates according to 'circuitData'
app.get('/api/circuitdatadates', (req, res) => {
  const { key } = req.query;
  console.log(req.query);
  if (key) {
    circuitDataModel.find({
      key: key,
    }, (err, docs) => {
      if (err) throw err;
      if (docs.length !== 0) {
        var dates = [];
        for (let index = 0; index < docs.length; index++) {
          var newDate = docs[index].date;
          var isInside = dates.find(date => {
            return moment(date).format('Do MMM YYYY') === moment(newDate).format('Do MMM YYYY');
          })
          if (!isInside)
            dates.push(newDate);
        }
        res.status(200).json(dates);
      }
      else
        res.status(404).json({ result: 'Data not found!' })
    })
  }
});

// get requests which returns all of the datas according to date
app.get('/api/circuitdatas', (req, res) => {
  const { key, date } = req.query;
  console.log(req.query);
  if (key) {
    if (date) {
      var parseDate = new Date(date);
      var newDate = new Date(parseDate.getFullYear(), parseDate.getMonth(), parseDate.getDate());
      var newDate2 = new Date(parseDate.getFullYear(), parseDate.getMonth(), parseDate.getDate() + 1);
      console.log(newDate);
      console.log(newDate2);
      circuitDataModel.find({
        key: key,
        date: {
          $gte: newDate,
          $lt: newDate2
        }
      }, (err, docs) => {
        if (err) throw err;
        if (docs.length !== 0)
          res.status(200).json(docs);
        else
          res.status(404).json({ result: 'Data not found!' })
      })
    } else {
      circuitDataModel.find({ key: key }, (err, docs) => {
        if (err) throw err;
        if (docs.length !== 0)
          res.status(200).json(docs);
        else
          res.status(404).json({ result: 'Data not found!' })
      })
    }
  } else {
    res.status(404).json({ result: 'Key is not defined!' })
  }
});

// post requests which inserts new 'circuitData'
app.post('/api/circuitdatas', (req, res) => {
  const { key, motion, temperature, humidity, methane } = req.body;
  if (key && motion && temperature && humidity && methane) {
    const newCircuitData = new circuitDataModel({
      key: key,
      motion: motion,
      temperature: temperature,
      humidity: humidity,
      methane: methane
    });
    newCircuitData.save(err => {
      if (err)
        res.status(400).json({ result: err.message });
      else {
        circuitModel.find({ key: key }, (err, docs) => {
          if (err) throw err.message;
          if (docs.length > 0) {
            res.status(200).json({ result: docs[0] });
          } else {
            const newCircuit = new circuitModel({
              key: key,
              relay: false,
              tmpThreshold: 200,
              hmdThreshold: 200,
              metThreshold: 200,
              motThreshold: 200,
            });
            newCircuit.save(err => {
              if (err)
                res.status(400).json({ result: err.message });
              else
                res.status(200).json({ result: newCircuit });
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({ result: 'Data has missed parts!' });
  }
})

// post requests which updates 'circuit' datas.
app.post('/api/updatethresholds', (req, res) => {
  const { key, relay, tmpThreshold, hmdThreshold, metThreshold, motThreshold } = req.body;
  console.log('INCOMING DATA: ', req.body);
  if (key && relay !== null && tmpThreshold && hmdThreshold && metThreshold && motThreshold) {
    circuitModel.find({ key: key }, (err, docs) => {
      if (err) {
        console.log(err);
        res.status(404).json({ result: 'Error occured while updating circuit data!' });
      }
      if (docs.length > 0) {
        circuitModel.findOneAndUpdate({ key: key }, { relay: relay, tmpThreshold: tmpThreshold, hmdThreshold: hmdThreshold, metThreshold: metThreshold, motThreshold: motThreshold }, { useFindAndModify: false }, (err) => {
          if (err) {
            console.log(err);
            res.status(404).json({ result: 'Error occured while updating circuit data!' });
          }
          else {
            console.log('Thresholds updated successfully.');
            res.status(200).json({ result: 'Thresholds updated successfully.' });
          }
        });
      } else {
        console.log('Circuit could not found!');
        res.status(404).json({ result: 'Circuit could not found!' });
      }
    });
  } else {
    console.log('Data has missed parts!');
    res.status(404).json({ result: 'Data has missed parts!' });
  }
})

// start server at port ___
const port = 3030;
app.listen(port, _ => {
  console.log(`App is running at port ${port}`);
})