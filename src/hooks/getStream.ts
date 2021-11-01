import {connect, StreamClient} from 'getstream';
import {useEffect, useState} from 'react';
import {getEnv} from '~/utils/env';

const useGetStream = (
  token: string,
  notiSubscribeToken: string,
): any | undefined => {
  const [client, setClient] = useState<StreamClient | undefined>(undefined);
  const [clientSub, setClientSub] = useState<StreamClient | undefined>(
    undefined,
  );

  useEffect(() => {
    setClient(
      connect(
        getEnv('GET_STREAM_API_KEY'),
        token,
        getEnv('GET_STREAM_APP_ID'),
        {location: 'singapore'},
      ),
    );
    setClientSub(
      connect(
        getEnv('GET_STREAM_API_KEY'),
        notiSubscribeToken,
        getEnv('GET_STREAM_APP_ID'),
        {location: 'singapore'},
      ),
    );
    return () => {
      setClient(undefined);
      setClientSub(undefined);
    };
  }, [token]);

  return [client, clientSub];
};

export {useGetStream};
