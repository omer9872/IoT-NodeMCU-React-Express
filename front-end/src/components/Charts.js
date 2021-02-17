import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Select, InputLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VictoryChart, VictoryLine, VictoryLabel, VictoryScatter, VictoryVoronoiContainer, VictoryTooltip } from 'victory';
import {
  API_URL
} from './config';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid gray',
    backgroundColor: 'white',
    borderRadius: '7px',
    margin: '20px',
  },
  chartCaption: {
    margin: '10px',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  dateBar: {
    margin: '20px'
  },
}));

function Charts(props) {
  const classes = useStyles();

  const [deviceKey] = useState(props.deviceKey);
  const [date, setDate] = useState(0);
  const [dates, setDates] = useState([]);
  const [showDeviceDatas, setShowDeviceDatas] = useState(false);

  const [tmp, setTmp] = useState([]);
  const [hmd, setHmd] = useState([]);
  const [met, setMet] = useState([]);
  const [mot, setMot] = useState([]);

  const [datas, setDatas] = useState([]);

  const fetchCircuitDates = function () {
    axios.get(`${API_URL}circuitdatadates?key=${deviceKey}`)
      .then(res => {
        console.log(res.data);
        if (res.data.length > 0) {
          setDates(res.data);
        }
      })
      .catch(err => {
        alert('Error Occured While Fetching Datas.')
      })
  }

  const fetchDatasByDate = function () {
    axios.get(`${API_URL}circuitdatas?key=${deviceKey}&date=${date}`)
      .then(res => {
        if (res.data.length > 0) {
          setDatas(res.data);
        }
      })
      .catch(err => {
        alert('Error Occured While Fetching Datas.')
      })
  }

  useEffect(() => {
    fetchCircuitDates();
  }, []);

  useEffect(() => {
    if (date != 0) {
      fetchDatasByDate();
    } else {
      setShowDeviceDatas(false);
    }
  }, [date]);

  useEffect(() => {
    if (datas.length > 0) {
      setShowDeviceDatas(true);
      var tmpArr = [];
      var hmdArr = [];
      var metArr = [];
      var motArr = [];
      datas.forEach(data => {
        var tmp = { xx: moment(data.date).format('hh:mm'), y: data.temperature };
        var hmd = { xx: moment(data.date).format('hh:mm'), y: data.humidity };
        var met = { xx: moment(data.date).format('hh:mm'), y: data.methane };
        var mot = { xx: moment(data.date).format('hh:mm'), y: data.motion };
        tmpArr.push(tmp);
        hmdArr.push(hmd);
        metArr.push(met);
        motArr.push(mot);
      });
      setTmp(tmpArr);
      setHmd(hmdArr);
      setMet(metArr);
      setMot(motArr);
    }
  }, [datas]);

  return (
    <div className={classes.container}>
      <FormControl variant="filled" className={classes.dateBar}>
        <InputLabel id="demo-simple-select-filled-label">Circuit Data Date</InputLabel>
        <Select
          native
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={date || ''}
          onChange={(e) => { setDate(e.target.value) }}
        >
          <option value={0}>Please Select Date</option>
          {dates.length > 0 ? dates.map((date, index) => {
            return <option key={index} value={date}>{moment(date).format('MMMM Do YYYY')}</option>
          }):<option value={1}>Could Not Found Any Date!</option>}
        </Select>
      </FormControl>
      {showDeviceDatas ? <div>
        <div className={classes.chartContainer}>
          <p className={classes.chartCaption}>Temperature Datas (&#176;C)</p>
          <p className={classes.chartCaption}>{props.date}</p>
          <VictoryChart
            width={1000}
            height={500}
            domain={{ y: [-20, 50] }}
            containerComponent={<VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${"   Temperature: " + datum.y + "\n   " + "Clock: " + datum.xx}`}
            />}
          >
            <VictoryLine
              data={tmp}
              style={{
                data: { stroke: "#E14949", strokeWidth: ({ active }) => active ? 10 : 6 },
                labels: { fill: "#E14949" }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />

          </VictoryChart>
        </div>
        <div className={classes.chartContainer}>
          <p className={classes.chartCaption}>Humidity Datas (%)</p>
          <p className={classes.chartCaption}>{props.date}</p>
          <VictoryChart
            width={1000}
            height={300}
            domain={{ y: [0, 100] }}
            containerComponent={<VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${"   Humidity: %" + datum.y + "\n   " + "Clock: " + datum.xx}`}
            />}
          >
            <VictoryLine
              data={hmd}
              style={{
                data: { stroke: "#5249E1", strokeWidth: ({ active }) => active ? 10 : 6 },
                labels: { fill: "#5249E1" }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        </div>
        <div className={classes.chartContainer}>
          <p className={classes.chartCaption}>Methane Datas (%)</p>
          <p className={classes.chartCaption}>{props.date}</p>
          <VictoryChart
            width={1000}
            height={300}
            domain={{ y: [0, 100] }}
            containerComponent={<VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${"   Methane: %" + datum.y + "\n   " + "Clock: " + datum.xx}`}
            />}
          >
            <VictoryLine
              data={met}
              style={{
                data: { stroke: "#49D3E1", strokeWidth: ({ active }) => active ? 10 : 6 },
                labels: { fill: "#49D3E1" }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        </div>
        <div className={classes.chartContainer}>
          <p className={classes.chartCaption}>Motion Datas</p>
          <p className={classes.chartCaption}>{props.date}</p>
          <VictoryChart
            domain={{ y: [0, 1] }}
            width={1000}
            height={300}
            containerComponent={<VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${"   Motion: " + datum.y + "\n   " + "Clock: " + datum.xx}`}
            />}
          >
            <VictoryLine
              data={mot}
              style={{
                data: { stroke: "#49E14E", strokeWidth: ({ active }) => active ? 10 : 6 },
                labels: { fill: "#49E14E" }
              }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        </div>
      </div> : <div className='d-flex justify-content-center m-5'><p style={{ color: 'red' }}>Could not found any data at this date!</p></div>}
    </div>
  )
}

export default Charts;


/*

<VictoryScatter
              data={met}
              size={13}
              style={{ data: { fill: "#A44242" }, labels: { fill: "white", fontSize: 12, marginTop: '25px' } }}
              labels={({ datum }) => datum.y}
              labelComponent={<VictoryLabel dy={6} />}
            />

*/