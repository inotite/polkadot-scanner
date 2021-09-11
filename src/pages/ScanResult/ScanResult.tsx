import React from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import MainLayout from 'layouts/MainLayout/MainLayout';
import ScanResultTable from 'components/Tables/ScanResultTable';
import { ScanContext } from 'contexts/ScanContext';
import PolkadotProvider, { PolkadotContext } from 'contexts/PolkadotContext';
import { EventRecordInfo, getBlocksInfo } from 'utils';

const useStyles = makeStyles((theme: Theme) => ({
  scanResultContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
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

  React.useEffect(() => {
    if (api && startBlock && endBlock) {
      setLoading(true);
      getBlocksInfo(api, Number(startBlock), Number(endBlock))
        .then(eventsInfo => setEvents(eventsInfo))
        .finally(() => setLoading(false));
    }
  }, [api, startBlock, endBlock]);

  return <MainLayout crumb='Polkadot Scanner / Scan Results'>
    <div className={classes.scanResultContainer}>
      <ScanResultTable loading={isLoading} events={events} />
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
