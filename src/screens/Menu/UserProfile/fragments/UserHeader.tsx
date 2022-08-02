import { StyleSheet, View } from 'react-native'
import React from 'react'
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import WorkInfo from '../components/WorkInfo';

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
    <View style={styles.headerName}>
      <Text>
        <Text.H4>{fullname}</Text.H4>
      </Text>
      {!!username && <Text.BodyS>{`@${username}`}</Text.BodyS>}
      <WorkInfo latestWork={latestWork} />
      {!!description && (
      <Text>
        <Text style={styles.subtitleText}>{description}</Text>
      </Text>
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
