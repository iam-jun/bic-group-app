import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Icon from '~/beinComponents/Icon';
import { useUserIdAuth } from '~/hooks/auth';
import { spacing } from '~/theme';

interface Props {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  userId: string;
  currentUsername: string;
  onPress?: () => void;
}

const EditButton = ({
  style, testID, userId, currentUsername, onPress,
}: Props) => {
  const theme:ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const currentUserId = useUserIdAuth();

  const isCurrentUser = userId === currentUserId || userId === currentUsername;

  if (!isCurrentUser) return null;

  return (
    <ButtonWrapper
      testID={testID}
      style={[styles.editButton, style]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Icon size={16} tintColor={theme.colors.purple60} icon="Camera" />
    </ButtonWrapper>
  );
};

const themeStyles = (
  theme: ExtendedTheme,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    editButton: {
      backgroundColor: colors.violet1,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing?.borderRadius.small,
      marginLeft: spacing?.padding.small,
    },
  });
};

export default EditButton;
