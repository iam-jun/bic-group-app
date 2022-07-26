import { StyleProp, ViewStyle } from 'react-native';

export interface ImageGalleryModalProps {
  visible: boolean;
  source: any;
  onPressClose: () => void;
  initIndex?: number;
  alwaysShowFileName?: boolean;

  // web
}
