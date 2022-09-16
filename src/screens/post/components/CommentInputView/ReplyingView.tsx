import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';
import { useKeySelector } from '~/hooks/selector';
import { IPayloadReplying } from '~/interfaces/IPost';

import postKeySelector from '../../../../storeRedux/post/keySelector';

import Text from '~/beinComponents/Text';
import postActions from '../../../../storeRedux/post/actions';
import { useUserIdAuth } from '~/hooks/auth';
import spacing from '~/theme/spacing';

const ReplyingView = () => {
  const dispatch = useDispatch();
  const replying: IPayloadReplying = useKeySelector(postKeySelector.replyingComment);

  const userId = useUserIdAuth();

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const replyTargetUser = replying?.comment?.actor || replying?.parentComment?.actor;
  const replyTargetUserId = replyTargetUser?.id;
  let replyTargetName = replyTargetUser?.fullname;
  if (replyTargetUserId === userId) {
    replyTargetName = i18next.t('post:label_yourself');
  }

  const loading = useKeySelector(postKeySelector.createComment.loading);

  if (!replying) {
    return null;
  }

  const onPress = () => {
    !loading && dispatch(postActions.setPostDetailReplyingComment());
  };

  return (
    <View style={styles.commentInputHeader}>
      <View style={styles.headerContent}>
        <Text.BodyXS>
          {i18next.t('post:label_replying_to')}
          <Text.BodyXSMedium>
            {replyTargetName || i18next.t('post:someone')}
          </Text.BodyXSMedium>
          <Text.BodyXS>
            {' • '}
            <Text.BodyXS useI18n onPress={onPress}>
              common:btn_cancel
            </Text.BodyXS>
          </Text.BodyXS>
        </Text.BodyXS>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {},
    flex1: { flex: 1 },
    row: { flexDirection: 'row' },
    commentInputHeader: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.xSmall,
      borderBottomWidth: 1,
      borderColor: colors.neutral5,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default React.memo(ReplyingView);
