import React from 'react';
import { ScanInformation } from 'interfaces';
import { DEFAULT_SCAN_INFO } from 'constants/scan';

interface ScanContextProps {
  info: ScanInformation;
  setInfo: (info: ScanInformation) => void;
}

export const ScanContext = React.createContext<ScanContextProps>(null!);

const ScanProvider: React.FC = ({ children }) => {
  const [info, setInfo] = React.useState(DEFAULT_SCAN_INFO);

  return <ScanContext.Provider value={{
    info,
    setInfo,
  }}>{children}</ScanContext.Provider>;
};

export default ScanProvider;
