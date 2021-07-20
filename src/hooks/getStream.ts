import {connect, StreamClient} from 'getstream';
import {useEffect, useState} from 'react';
import Config from 'react-native-config';

const useGetStream = (token: string): StreamClient | undefined => {
  const [client, setClient] = useState<StreamClient | undefined>(undefined);

  useEffect(() => {
    setClient(
      connect(Config.GET_STREAM_API_KEY, token, Config.GET_STREAM_APP_ID),
    );
  }, [token]);

  return client;
};

export {useGetStream};
