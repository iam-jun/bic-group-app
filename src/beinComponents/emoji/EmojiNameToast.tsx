import React, {
  FC,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import {View, StyleSheet} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import SimpleToastMessage from '~/beinComponents/ToastMessage/SimpleToastMessage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface EmojiNameToastProps {
  toastRef: any;
}

const EmojiNameToast: FC<EmojiNameToastProps> = ({
  toastRef,
}: EmojiNameToastProps) => {
  const [name, setName] = useState('');
  const timeOutRef = useRef<any>();

  const theme = useTheme() as ExtendedTheme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);

  useEffect(() => {
    return () => {
      timeOutRef?.current && clearTimeout(timeOutRef?.current);
    };
  }, []);

  const show = (name: string) => {
    timeOutRef?.current && clearTimeout(timeOutRef?.current);
    setName(name);
    timeOutRef.current = setTimeout(() => {
      setName('');
    }, 3000);
  };

  useImperativeHandle(toastRef, () => ({
    show,
  }));

  if (!name) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SimpleToastMessage disabled>{name}</SimpleToastMessage>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme, insets: any) => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: 100 + insets.bottom,
    },
  });
};

export default EmojiNameToast;
