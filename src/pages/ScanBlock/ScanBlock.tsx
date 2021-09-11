import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Theme } from "@material-ui/core/styles";
import MainLayout from 'layouts/MainLayout/MainLayout';
import ScanBlockForm from 'components/Forms/ScanBlockForm/ScanBlockForm';
import { ScanInformation } from 'interfaces';
import Routes from 'routes';
import { ScanContext } from 'contexts/ScanContext';

const useStyles = makeStyles((theme: Theme) => ({
  scanBlockContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const ScanBlock: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { setInfo } = useContext(ScanContext);

  const handleScan = React.useCallback((values: ScanInformation) => {
    setInfo(values);
    history.push(Routes.Result.path);
  }, [history, setInfo]);

  return <MainLayout>
    <div className={classes.scanBlockContainer}>
      <ScanBlockForm onScan={handleScan} />
    </div>
  </MainLayout>
};

export default ScanBlock;
