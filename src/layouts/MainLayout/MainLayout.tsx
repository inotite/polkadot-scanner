import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import NavBar from 'layouts/NavBar/NavBar';

const useStyles = makeStyles((theme: Theme) => ({
  layoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  content: {
    flex: 1
  }
}));

interface MainLayoutProps {
  crumb?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ crumb = 'Polkadot Scanner', children }) => {
  const classes = useStyles();

  return <div className={classes.layoutContainer}>
    <NavBar title={crumb} />
    <div className={classes.content}>
      {children}
    </div>
  </div>
};

export default MainLayout;
