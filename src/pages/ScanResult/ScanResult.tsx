import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from "@material-ui/core/styles";
import MainLayout from 'layouts/MainLayout/MainLayout';
import ScanResultTable from 'components/Tables/ScanResultTable';
import { ScanContext } from 'contexts/ScanContext';
import PolkadotProvider, { PolkadotContext } from 'contexts/PolkadotContext';
import { EventRecordInfo, getBlocksInfo } from 'utils';
import Routes from 'routes';

const useStyles = makeStyles((theme: Theme) => ({
  scanResultContainer: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
}));

interface ScanResultProps {
  startBlock?: number;
  endBlock?: number;
}

const ScanResult: React.FC<ScanResultProps> = ({ startBlock, endBlock }) => {
  const classes = useStyles();
  const { api } = React.useContext(PolkadotContext);
  const [isLoading, setLoading] = React.useState(true);
  const [events, setEvents] = React.useState<EventRecordInfo[]>([]);
  const history = useHistory();

  React.useEffect(() => {
    if (api && startBlock && endBlock) {
      setLoading(true);
      getBlocksInfo(api, Number(startBlock), Number(endBlock))
        .then(eventsInfo => setEvents(eventsInfo))
        .finally(() => setLoading(false));
    }
  }, [api, startBlock, endBlock]);

  const handleScanAgain = React.useCallback(() => {
    history.push(Routes.Scan.path);
  }, [history]);

  return <MainLayout crumb='Polkadot Scanner / Scan Results'>
    <div className={classes.scanResultContainer}>
      <ScanResultTable loading={isLoading} events={events} />
      <Button
        color='primary'
        disabled={isLoading}
        variant='contained'
        onClick={handleScanAgain}
      >
        Scan Again
      </Button>
    </div>
  </MainLayout>
};

const ScanResultWithPolkadot = () => {
  const { info } = React.useContext(ScanContext);

  return <PolkadotProvider endpoint={info?.endpoint}>
    <ScanResult startBlock={info.startBlock} endBlock={info.endBlock} />
  </PolkadotProvider>
}

export default ScanResultWithPolkadot;
