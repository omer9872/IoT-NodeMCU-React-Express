import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Select, FormControl, FormControlLabel, InputLabel, Switch } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import {
  API_URL
} from './config';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEDED'
  },
  updateBar: {
    minWidth: '75%',
    margin: '10px'
  },
  btn: {
    textTransform: 'none',
    minWidth: '75%',
    margin: '15px',
    color: 'white',
  }
}));

function UpdateCircuit(props) {
  const classes = useStyles();

  const [relay, setRelay] = useState(props.relay);
  const [tmpThresh, setTmpThresh] = useState(props.tmt);
  const [hmdThresh, setHmdThresh] = useState(props.hmt);
  const [metThresh, setMetThresh] = useState(props.met);
  const [motThresh, setMotThresh] = useState(props.mot);

  const [updateDataText, setUpdateDataText] = useState(null);

  const updateThreshes = function () {
    axios.post(`${API_URL}updatethresholds`, { key: props.deviceKey, relay: relay, tmpThreshold: tmpThresh, hmdThreshold: hmdThresh, metThreshold: metThresh, motThreshold: motThresh })
      .then(res => {
        if (res.status === 200) {
          setUpdateDataText(<p style={{ color: 'green' }}>Thresholds updated successfully.</p>);
        } else {
          setUpdateDataText(<p style={{ color: 'red' }}>Error occured while updating thresholds!</p>);
        }
      })
      .catch(err => {
        setUpdateDataText(<p style={{ color: 'red' }}>Error occured while updating thresholds!</p>);
      })
  }

  return (
    <div className={classes.container}>
      <div style={{ margin: '15px', backgroundColor: relay ? '#2D9AEA' : '#EA2D2D', borderRadius: '15px', display: 'flex', flexFlow: 'row wrap' }}>
        <FormControlLabel
          style={{ padding: '0px', margin: '0px' }}
          control={
            <Switch
              checked={relay}
              onChange={(e) => {
                setRelay(e.target.checked);
              }}
              name="checkedB"
              color="primary"
            />
          }
        />
        <p style={{ margin: '15px', color: 'white' }}>{`Relay Status: ${relay ? 'ON' : 'OFF'}`}</p>
      </div>

      <FormControl className={classes.updateBar}>
        <InputLabel id="demo-simple-select-outlined-label">Temperature Alarm Threshold</InputLabel>
        <Select
          native
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={tmpThresh}
          onChange={(e) => {
            setTmpThresh(e.target.value);
          }}
        >
          <option value={200}>Alarm Disabled</option>
          <option value={20}>20&#176; and above</option>
          <option value={25}>25&#176; and above</option>
          <option value={30}>30&#176; and above</option>
          <option value={35}>35&#176; and above</option>
          <option value={40}>40&#176; and above</option>
        </Select>

      </FormControl>

      <FormControl className={classes.updateBar}>
        <InputLabel id="demo-simple-select-outlined-label">Humidity Alarm Threshold</InputLabel>
        <Select
          native
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={hmdThresh}
          onChange={(e) => {
            console.log(e.target.value);
            setHmdThresh(e.target.value);
          }}
        >
          <option value={200}>Alarm Disabled</option>
          <option value={10}>%10 or above</option>
          <option value={20}>%20 or above</option>
          <option value={30}>%30 or above</option>
          <option value={40}>%40 or above</option>
          <option value={50}>%50 or above</option>
          <option value={60}>%60 or above</option>
          <option value={70}>%70 or above</option>
          <option value={80}>%80 or above</option>
          <option value={90}>%90 or above</option>
          <option value={100}>%100</option>
        </Select>
      </FormControl>

      <FormControl className={classes.updateBar}>
        <InputLabel id="demo-simple-select-outlined-label">Methane Alarm Threshold</InputLabel>
        <Select
          native
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={metThresh}
          onChange={(e) => {
            console.log(e.target.value);
            setMetThresh(e.target.value);
          }}
        >
          <option value={200}>Alarm Disabled</option>
          <option value={10}>%10 or above</option>
          <option value={20}>%20 or above</option>
          <option value={30}>%30 or above</option>
          <option value={40}>%40 or above</option>
          <option value={50}>%50 or above</option>
          <option value={60}>%60 or above</option>
        </Select>
      </FormControl>

      <FormControl className={classes.updateBar}>
        <InputLabel id="demo-simple-select-outlined-label">Motion Alarm Threshold</InputLabel>
        <Select
          native
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={motThresh}
          onChange={(e) => {
            console.log(e.target.value);
            setMotThresh(e.target.value);
          }}
        >
          <option value={200}>Alarm Disabled</option>
          <option value={1}>Enabled</option>
        </Select>
      </FormControl>

      <Button
        onClick={updateThreshes}
        variant="contained"
        color="primary"
        className={classes.btn}
        startIcon={<SaveIcon style={{ color: 'white' }}></SaveIcon>}
      >Update Thresholds</Button>

      {updateDataText}

    </div>
  )
}

export default UpdateCircuit;