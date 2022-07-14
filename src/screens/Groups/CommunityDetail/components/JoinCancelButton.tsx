import React, {Fragment} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import {useKeySelector} from '~/hooks/selector';
import {ITheme} from '~/theme/interfaces';
import groupsKeySelector from '../../redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';

interface JoinCancelButtonProps {
  style?: ViewStyle;
}

const JoinCancelButton = ({style}: JoinCancelButtonProps) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const {
    privacy,
    join_status,
    id: communityId,
    name: communityName,
  } = infoDetail;
  const isPrivate = privacy === groupPrivacy.private;
  const isMember = join_status === groupJoinStatus.member;
  const hasRequested = join_status === groupJoinStatus.requested;

  if (isMember) return null;

  const onPressJoin = () => {
    dispatch(groupsActions.joinCommunity({communityId, communityName}));
  };

  const onPressCancelRequest = () => {
    dispatch(groupsActions.cancelJoinCommunity({communityId, communityName}));
  };

  return (
    <Fragment>
      <View style={[styles.buttonView, style]} testID="join_cancel_button">
        {hasRequested ? (
          <Button.Secondary
            testID="join_cancel_button.cancel"
            style={styles.btnAction}
            color={theme.colors.bgDisable}
            textColor={theme.colors.textPrimary}
            onPress={onPressCancelRequest}
            useI18n>
            common:btn_cancel_request
          </Button.Secondary>
        ) : (
          <Button.Secondary
            testID="join_cancel_button.join"
            leftIcon={'Plus'}
            leftIconProps={{icon: 'Plus', size: 20}}
            style={styles.btnAction}
            color={theme.colors.primary6}
            textColor={theme.colors.background}
            colorHover={theme.colors.primary6}
            onPress={onPressJoin}
            useI18n>
            communities:text_join_community_button
          </Button.Secondary>
        )}

        {isPrivate && (
          <View style={styles.shortDesc}>
            <Text.BodyS
              color={theme.colors.textSecondary}
              useI18n
              testID="join_cancel_button.description">
              communities:text_join_community_description
            </Text.BodyS>
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
    btnAction: {
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
