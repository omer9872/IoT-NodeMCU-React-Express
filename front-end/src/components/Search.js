import React, { useEffect, useState } from 'react';
import { TextField, Button, Select } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { green } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
  textBar: {
    marginTop: '15px',
    marginLeft: '15px',
    marginRight: '15px'
  },
  btn: {    
    textTransform:'none',
    margin: '15px',
  },
  border: {
    width: '100%',
    marginTop: '0px',
    borderTop: '1px solid #8A8A8A'
  },
}));
const GreenButton = withStyles((theme) => ({
  root: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);

function Search(props) {
  const classes = useStyles();

  return (
    <div className='search'>
      <TextField onChange={(e) => { props.getKeyFunc(e.target.value) }} className={classes.textBar} id="outlined-basic" label="Device Key" variant="outlined" />
      <GreenButton
        onClick={props.fetchDatasFunc}
        variant="contained"
        color="primary"
        className={classes.btn}
        startIcon={<FindInPageIcon></FindInPageIcon>}
      >Fetch Device Data</GreenButton>
      <div className={classes.border}></div>
    </div>
  )
}

export default Search;