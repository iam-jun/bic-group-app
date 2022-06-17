import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import TextBadge from '~/beinComponents/Badge/TextBadge';
import Button from '~/beinComponents/Button';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

export interface SystemSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const SystemScheme: FC<SystemSchemeProps> = ({style}: SystemSchemeProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const {colors} = theme || {};

  const {data: communityScheme, loading} =
    useKeySelector(groupsKeySelector.permission.communityScheme) || {};

  const onPressView = () => {
    alert('Show permission detail');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 useI18n>communities:permission:title_system_scheme</Text.H5>
          {!loading && !communityScheme && (
            <TextBadge useI18n value={'common:text_activated'} />
          )}
        </View>
        <Button.Primary
          onPress={onPressView}
          useI18n
          textColor={colors.textPrimary}
          style={styles.buttonView}>
          communities:permission:btn_view_permission
        </Button.Primary>
      </View>
      <Text.Subtitle useI18n>
        communities:permission:text_desc_system_scheme
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
    buttonView: {
      paddingVertical: spacing.padding.tiny,
      backgroundColor: colors.bgHover,
    },
  });
};

export default SystemScheme;
