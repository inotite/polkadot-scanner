import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Routes from 'routes';
import ScanBlock from 'pages/ScanBlock/ScanBlock';
import ScanResult from 'pages/ScanResult/ScanResult';
import ScanProvider from 'contexts/ScanContext';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100vh'
  }
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ScanProvider>
        <Router>
          <Switch>
            <Route exact path={Routes.Scan.path} component={ScanBlock} />
            <Route exact path={Routes.Result.path} component={ScanResult} />
          </Switch>
        </Router>
      </ScanProvider>
    </div>
  );
}

export default App;
