import React, {Fragment} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import groupsKeySelector from '../../redux/keySelector';

interface JoinCancelButtonProps {
  style?: ViewStyle;
}

const JoinCancelButton = ({style}: JoinCancelButtonProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {privacy, join_status} = infoDetail;
  const isPrivate = privacy === groupPrivacy.private;
  const isMember = join_status === groupJoinStatus.member;

  if (isMember) return null;

  const onPressJoin = () => {
    // TODO: Add press Join
  };

  return (
    <Fragment>
      <View style={[styles.buttonView, style]} testID="join_cancel_button">
        <Button.Secondary
          testID="join_cancel_button.join"
          leftIcon={'Plus'}
          leftIconProps={{icon: 'Plus', size: 20}}
          style={styles.btnJoin}
          color={theme.colors.primary6}
          textColor={theme.colors.background}
          colorHover={theme.colors.primary6}
          onPress={onPressJoin}
          useI18n>
          communities:text_join_community_button
        </Button.Secondary>
        {isPrivate && (
          <View style={styles.shortDesc}>
            <Text.Subtitle
              color={theme.colors.textSecondary}
              useI18n
              testID="join_cancel_button.description">
              communities:text_join_community_description
            </Text.Subtitle>
          </View>
        )}
      </View>
    </Fragment>
  );
};

export default JoinCancelButton;

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    btnJoin: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.padding.small,
      padding: spacing.padding.base,
    },
    shortDesc: {
      alignSelf: 'center',
    },
    buttonView: {
      backgroundColor: colors.background,
      paddingBottom: spacing.padding.small,
    },
  });
};
