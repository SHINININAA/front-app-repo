import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';
import UpperPage from './page/UpperPage'; // Adjust path if needed

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  searchRoot: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
}));

function App(props) {
  const classes = useStyles();
  const [data, setData] = useState({ outcome: [] });
  const [query, setQuery] = useState('eks');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `http://k8s-eksdemogroup-e0353f9ab7-1386321306.ap-northeast-2.elb.amazonaws.com/contents/${query}`;
      const result = await axios(url);
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({ outcome: [] }); // Reset data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#2E3B55' }}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <CloudIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            EKS DEMO Blog version 1
          </Typography>
          <Typography variant="body2">
            {new Date().toLocaleTimeString()}
          </Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.content}>
        <UpperPage key={1} />
        <br />

        <form className={classes.searchRoot} noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            label="Enter your keyword to search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button variant="contained" color="primary" onClick={fetchData}>
            Search
          </Button>
        </form>

        {loading ? (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        ) : (
          <ul>
            {data.outcome.map((item) => (
              <li key={item.url}>
                <a href={item.url}>{item.title}</a>
                <br />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

App.propTypes = {
  sections: PropTypes.array,
};

export default App;
