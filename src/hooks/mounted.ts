import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

const useMounted = (callback?: () => void) => {
  const [interactionsCompleted, setInteractionsCompleted] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setInteractionsCompleted(true);
      callback?.();
    });
  }, []);

  return interactionsCompleted;
};

export default useMounted;
