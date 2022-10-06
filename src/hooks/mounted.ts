import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

const useMounted = () => {
  const [interactionsCompleted, setInteractionsCompleted] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => setInteractionsCompleted(true));
  }, []);

  return interactionsCompleted;
};

export default useMounted;
