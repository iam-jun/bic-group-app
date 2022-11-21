import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
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
  const { colors } = useTheme();

  return (
    <View testID="user_profile" style={styles.headerName}>
      <Text.H4 testID="user_profile.fullname" numberOfLines={1}>{fullname}</Text.H4>
      {!!username && (
        <Text.BodyS
          testID="user_profile.username"
          color={colors.neutral40}
          style={styles.subtitle}
        >
          {`@${username}`}
        </Text.BodyS>
      )}
      <WorkInfo style={styles.subtitle} latestWork={latestWork} />
      {!!description && (
        <Text testID="user_profile.description" style={styles.subtitle}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerName: {
    alignItems: 'center',
    paddingBottom: spacing.margin.base,
    paddingHorizontal: spacing.margin.large,
  },
  subtitle: {
    marginTop: spacing.margin.small,
    textAlign: 'center',
  },
});

export default UserHeader;
