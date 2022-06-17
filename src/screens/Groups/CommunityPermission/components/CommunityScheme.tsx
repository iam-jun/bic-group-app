import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';

export interface CommunitySchemeProps {
  style?: StyleProp<ViewStyle>;
}

const CommunityScheme: FC<CommunitySchemeProps> = ({
  style,
}: CommunitySchemeProps) => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {loading: loadingCommunityScheme, data: communityScheme} =
    useKeySelector(groupsKeySelector.permission.communityScheme) || {};

  const onPressCreate = () => {
    rootNavigation.navigate(groupStack.createPermissionScheme);
  };

  return (
    <View style={styles.container}>
      <View style={styles.flex1}>
        <Text.H5 useI18n>communities:permission:title_community_scheme</Text.H5>
        <Text.Subtitle useI18n>
          communities:permission:text_desc_community_scheme
        </Text.Subtitle>
      </View>
      <View>
        <Button.Primary
          onPress={onPressCreate}
          useI18n
          style={styles.buttonCreate}
          leftIcon={'Plus'}>
          common:btn_create
        </Button.Primary>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flexDirection: 'row',
      padding: spacing.padding.large,
      backgroundColor: colors.background,
      marginTop: spacing.margin.base,
      borderRadius: spacing.borderRadius.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonCreate: {
      paddingLeft: 0,
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,
    },
  });
};

export default CommunityScheme;
