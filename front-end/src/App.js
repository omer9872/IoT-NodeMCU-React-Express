import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import './components/index.css';
import {
  API_URL
} from './components/config';

import Search from './components/Search';
import Entry from './components/Entry';
import Charts from './components/Charts';
import UpdateCircuit from './components/UpdateCircuit';

const useStyles = makeStyles((theme) => ({
  body: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    minWidth: '75%',
    maxWidth: '95%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
    boxShadow: "2px 6px 20px 0px rgba(0,0,0,0.5)",
  },
}));

function App() {
  const classes = useStyles();

  const [deviceKey, setDeviceKey] = useState('null');

  const [showDevice, setShowDevice] = useState(false);

  const [relay, setRelay] = useState(false);
  const [tmpThreshold, setTmpThreshold] = useState(200);
  const [hmdThreshold, setHmdThreshold] = useState(200);
  const [metThreshold, setMetThreshold] = useState(200);
  const [motThreshold, setMotThreshold] = useState(200);

  const [entryTextDevice, setEntryTextDevice] = useState('Please enter device key to see datas.');

  const fetchDevice = function () {
    axios.get(`${API_URL}circuit?key=${deviceKey}`)
      .then(res => {
        if (res.data.length > 0) {
          setRelay(res.data[0].relay);
          setTmpThreshold(res.data[0].tmpThreshold);
          setHmdThreshold(res.data[0].hmdThreshold);
          setMetThreshold(res.data[0].metThreshold);
          setMotThreshold(res.data[0].motThreshold);
          setShowDevice(true);
          setEntryTextDevice('Device datas successfully found.');
        } else {
          setShowDevice(false);
          setEntryTextDevice('Device datas could not found!');
        }
      })
      .catch(err => {
        setShowDevice(false);
        setEntryTextDevice('Device datas could not found!');
      })
  }

  const getAllDeviceDatas = function () {
    fetchDevice();
  }

  const getDeviceKey = function (deviceKey) {
    setDeviceKey(deviceKey);
  }

  return (
    <div className={'m-0 p-0 bg-soft-gray d-flex flex-center align-center content-center flex-column col-12'}>
      <Search fetchDatasFunc={getAllDeviceDatas} getKeyFunc={getDeviceKey}></Search>
      <Entry entryTextDevice={entryTextDevice}></Entry>
      {showDevice ? <UpdateCircuit relay={relay} tmt={tmpThreshold} hmt={hmdThreshold} met={metThreshold} mot={motThreshold} deviceKey={deviceKey}></UpdateCircuit> : null}
      {showDevice ? <Charts deviceKey={deviceKey}></Charts> : null}
      <footer className='styled-footer'>
        <p>Ömer Yakup Akbaş - 161805014</p>
      </footer>
    </div>
  );
}

export default App;
