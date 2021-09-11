import React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

interface PolkadotContextProps {
  api: ApiPromise;
}

export const PolkadotContext = React.createContext<PolkadotContextProps>(null!);

interface PolkadotProviderProps {
  endpoint: string;
}

const PolkadotProvider: React.FC<PolkadotProviderProps> = ({ endpoint, children }) => {

  const [api, setApi] = React.useState<ApiPromise>(null!);

  React.useEffect(() => {
    if (endpoint) {
      const wsProvider = new WsProvider(endpoint);
      ApiPromise.create({provider: wsProvider})
        .then(res => setApi(res))
        .catch(err => console.log(err));
    }
  }, [endpoint]);

  return <PolkadotContext.Provider value={{ api }}>
    {children}
  </PolkadotContext.Provider>
}

export default PolkadotProvider;
