import { StyleSheet, View } from 'react-native'
import React from 'react'
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import WorkInfo from '../../components/WorkInfo';

interface Props {
fullname: string;
username: string;
 latestWork?: {
    titlePosition: string;
    company: string;
};
description?: string;
}

const UserHeader = ({
  fullname, username, latestWork, description,
}:Props) => {
  const theme:ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View testID="user_profile" style={styles.headerName}>
      <Text.H4 testID="user_profile.fullname">{fullname}</Text.H4>
      {!!username && (
      <Text.BodyS testID="user_profile.username">
        {`@${username}`}
      </Text.BodyS>
      )}
      <WorkInfo latestWork={latestWork} />
      {!!description && (
        <Text testID="user_profile.description" style={styles.subtitleText}>{description}</Text>
      )}
    </View>
  )
}

const themeStyles = (
  theme: ExtendedTheme,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    headerName: {
      alignItems: 'center',
      paddingVertical: spacing.margin.base,
      paddingHorizontal: spacing.margin.large,
    },
    subtitleText: {
      marginTop: spacing.margin.small,
      textAlign: 'center',
    },
  });
}

export default UserHeader;
