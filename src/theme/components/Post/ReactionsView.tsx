import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useBaseHook} from '~/hooks';
import {formatText} from '~/utils/format';

import HorizontalView from '../Layout/HorizontalView';
import ReactionItem from '../List/items/ReactionItem';
import Text from '../Text';
import {
  primary as LIKE_BUTTON_COLOR,
  white as WHITE_COLOR,
} from '~/theme/configs/colors';
import {padding} from '~/theme/configs/spacing';

export interface Props {
  isLike?: boolean;
  like?: number;
  comment?: number;
  share?: number;
  onLikePress?: () => void;
}

const ReactionsView: React.FC<Props> = ({
  isLike = true,
  like = 0,
  comment = 0,
  share = 0,
  onLikePress,
}) => {
  const {t} = useBaseHook();

  return (
    <HorizontalView style={styles.container}>
      {like > 0 && (
        <TouchableOpacity onPress={onLikePress}>
          <ReactionItem
            icon={{
              icon: 'iconLike',
              bold: true,
              backgroundColor: LIKE_BUTTON_COLOR,
            }}
            value={
              isLike && like > 1
                ? formatText('post:label_likes_with_me', like)
                : like
            }
            tintColor={WHITE_COLOR}
          />
        </TouchableOpacity>
      )}
      <HorizontalView>
        {comment > 0 && (
          <Text style={styles.label}>
            {`${comment} ${
              comment === 1 ? t('post:label_comment') : t('post:label_comments')
            }`}
          </Text>
        )}
        {share > 0 && (
          <Text style={styles.label}>
            {`${share} ${
              share === 1 ? t('post:label_share') : t('post:label_shares')
            }`}
          </Text>
        )}
      </HorizontalView>
    </HorizontalView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: padding.large,
    paddingBottom: 6,
    alignItems: 'center',
  },
  label: {
    marginStart: 4,
    fontSize: 12,
  },
});

export default ReactionsView;
