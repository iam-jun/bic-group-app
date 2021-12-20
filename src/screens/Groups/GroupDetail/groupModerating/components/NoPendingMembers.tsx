import React from 'react';
import {StyleSheet, View} from 'react-native';

import Text from '~/beinComponents/Text';
import NoPendingMembersImg from '~/../assets/images/no_pending_members.svg';
import SvgIcon from '~/beinComponents/Icon/SvgIcon';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

const NoPendingMembers = () => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  return (
    <View style={styles.container}>
      {/* @ts-ignore */}
      <SvgIcon source={NoPendingMembersImg} width={120} height={120} />
      <Text.ButtonBase style={styles.text} useI18n>
        {'groups:text_no_pending_members_notice'}
      </Text.ButtonBase>
      <Text.Subtitle
        color={theme.colors.textSecondary}
        style={styles.text}
        useI18n>
        {'groups:text_pending_request_notice'}
      </Text.Subtitle>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    text: {
      textAlign: 'center',
      marginVertical: spacing.margin.tiny,
    },
  });
};

export default NoPendingMembers;
