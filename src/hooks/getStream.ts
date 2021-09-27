import {connect, StreamClient} from 'getstream';
import {useEffect, useState} from 'react';
import {getEnv} from '~/utils/env';

const useGetStream = (token: string): StreamClient | undefined => {
  const [client, setClient] = useState<StreamClient | undefined>(undefined);

  useEffect(() => {
    setClient(
      connect(
        getEnv('GET_STREAM_API_KEY'),
        token,
        getEnv('GET_STREAM_APP_ID'),
        {location: 'singapore'},
      ),
    );
  }, [token]);

  return client;
};

export {useGetStream};
