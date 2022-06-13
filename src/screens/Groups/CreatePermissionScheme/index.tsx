import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';

export interface CreatePermissionSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const CreatePermissionScheme: FC<CreatePermissionSchemeProps> = ({
  style,
}: CreatePermissionSchemeProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Header title={'Create Scheme'} />
      <Text>New Component CreatePermissionScheme</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default CreatePermissionScheme;
