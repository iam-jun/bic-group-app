import {useEffect} from 'react';
import {getEnv} from '~/utils/env';
import websocketClient from '~/services/chatSocket';

const useChatHook = (token: string): any | undefined => {
  //   const [client, setClient] = useState<WebSocket | undefined>(undefined);
  const connUrl = 'wss://chat.sbx.bein.group/api/v4/websocket';
  const websocketOpts = {
    connectionUrl: connUrl,
  };

  useEffect(() => {
    websocketClient.setFirstConnectCallback(() =>
      console.log('websocketClient FirstConnectCallback'),
    );
    websocketClient.setEventCallback((evt: any) =>
      console.log('websocketClient EventCallback', JSON.stringify(evt)),
    );

    return () => {
      websocketClient.close();
    };
  }, []);

  useEffect(() => {
    websocketClient.initialize(token, websocketOpts);
  }, [token]);

  return websocketClient.conn;
};

export default useChatHook;
