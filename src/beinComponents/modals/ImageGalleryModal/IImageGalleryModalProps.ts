import {StyleProp, ViewStyle} from 'react-native';

export interface ImageGalleryModalProps {
  visible: boolean;
  source: any;
  onPressClose: () => void;

  //web
  zoomIn?: boolean;
  onPressZoom?: () => void;
}
