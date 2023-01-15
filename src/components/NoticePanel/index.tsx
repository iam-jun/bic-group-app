import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';

import spacing from '~/theme/spacing';
import Divider from '~/beinComponents/Divider';

interface NoticePanelProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonPress?: () => void;
  onClose: () => void;
}

const NoticePanel = ({
  title, description, buttonText, onButtonPress, onClose,
}: NoticePanelProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <>
      <Divider color={theme.colors.gray5} size={spacing.margin.large} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text.BodySMedium testID="notice_panel.title" useI18n>
            {title}
          </Text.BodySMedium>
          <Text.BodyS style={styles.description} useI18n>
            {description}
          </Text.BodyS>
        </View>
        {!!buttonText && onButtonPress && (
          <Button.Primary
            testID="notice_panel.button_update"
            style={styles.closeButton}
            onPress={onButtonPress}
            useI18n
          >
            {buttonText}
          </Button.Primary>
        )}
        <Button
          testID="notice_panel.button_close"
          style={styles.closeButton}
          activeOpacity={0.9}
          onPress={onClose}
        >
          <Icon
            size={16}
            tintColor={theme.colors.neutral80}
            icon="iconClose"
          />
        </Button>
      </View>
    </>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    description: {
      color: colors.gray50,
      marginTop: spacing.margin.tiny / 2,
    },
    closeButton: {
      marginLeft: spacing.margin.small,
    },
    content: {
      flex: 1,
    },
    container: {
      width: '100%',
      backgroundColor: colors.white,
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
    },
  });
};

export default NoticePanel;
