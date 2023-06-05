import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import { ICommentData } from '~/interfaces/IPost';
import Text from '~/baseComponents/Text';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import { useBaseHook } from '~/hooks';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';

interface RepliesCommentProps {
    onPress: () => void;
    commentData: ICommentData;
}

const RepliesComment: React.FC<RepliesCommentProps> = ({
    onPress,
    commentData,
}) => {
    const { t } = useBaseHook();
    const theme: ExtendedTheme = useTheme();
    const { colors } = theme;

    const comment = useCommentsStore(useCallback(commentsSelector.getComment(commentData?.id), [commentData?.id]));
    const _commentData = comment || commentData || {};
    const { totalReply } = _commentData;
    const isNotShowReply = !totalReply || totalReply === 0;

    if (isNotShowReply) return null;

    return (
        <View style={styles.container}>
            <Button
                onPress={onPress}
                testID="replies_comment.count_reply"
            >
                <Text.BodySMedium color={colors.purple50}>
                    { `${t('post:button_reply_count', { count: totalReply })}` }
                </Text.BodySMedium>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 48,
        marginTop: spacing.margin.base,
    },
});

export default RepliesComment;
