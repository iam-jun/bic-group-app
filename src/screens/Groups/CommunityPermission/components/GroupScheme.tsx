import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';

export interface GroupSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const GroupScheme: FC<GroupSchemeProps> = ({style}: GroupSchemeProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPressCreate = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 useI18n>communities:permission:title_group_scheme</Text.H5>
        </View>
        <View style={styles.buttonContainer}>
          <Button.Primary
            onPress={onPressCreate}
            useI18n
            style={styles.buttonCreate}
            leftIcon={'Plus'}>
            common:btn_create
          </Button.Primary>
        </View>
      </View>
      <Text.Subtitle useI18n>
        communities:permission:text_desc_group_scheme
      </Text.Subtitle>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.background,
      marginTop: spacing.margin.base,
      borderRadius: spacing.borderRadius.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
    },
    buttonCreate: {
      paddingLeft: 0,
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,
    },
    buttonContainer: {minHeight: 30, justifyContent: 'center'},
  });
};

export default GroupScheme;
