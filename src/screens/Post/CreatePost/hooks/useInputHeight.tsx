import {useWindowDimensions} from 'react-native';

export default () => {
  const {height} = useWindowDimensions();
  const minInputHeight = height * 0.3;
  const contentHeight = height * 0.65;
  const maxInputHeight = contentHeight < 600 ? contentHeight : 600;

  return {
    minInputHeight,
    maxInputHeight,
  };
};
