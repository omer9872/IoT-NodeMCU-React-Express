import React, { useEffect, useState } from 'react';
import { TextField, Button, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import ErrorIcon from '@material-ui/icons/Error';
import './index.css';

const useStyles = makeStyles((theme) => ({
  container: {
    
  },
}));
function Entry(props) {
  const classes = useStyles();

  const [textStatus, setTextStatus] = useState(0);

  useEffect(() => {
    if(props.entryTextDevice === 'Device datas could not found!'){
      setTextStatus(-1);
    }
    if(props.entryTextDevice === 'Device datas successfully found.'){
      setTextStatus(1);
    }
  }, [props.entryTextDevice]);

  return (
    <div className='entry'>
      {textStatus === 1 ? <DoneOutlineIcon className='entry-icon' style={{color:'green'}}></DoneOutlineIcon> : textStatus === -1 ? <ErrorIcon className='entry-icon' style={{color:'red'}}></ErrorIcon> : <SearchIcon className='entry-icon'></SearchIcon>  }
      {textStatus === 1 ? <p className='entry-text' style={{color:'green'}}>{props.entryTextDevice}</p> : textStatus === -1 ? <p className='entry-text' style={{color:'red'}}>{props.entryTextDevice}</p> : <p className='entry-text'>{props.entryTextDevice}</p> }
    </div>
  )
}

export default Entry;