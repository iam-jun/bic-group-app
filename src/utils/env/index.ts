import Config from 'react-native-config';

const getEnv = (key: string) => Config[key];

export default getEnv;
