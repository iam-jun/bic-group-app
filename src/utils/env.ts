import Config from 'react-native-config';

const getEnv = (key: string) => {
  return Config[key];
};

export {getEnv};
