import React from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderView from '../../HeaderView';
import ScreenWrapper from '../../ScreenWrapper';
import MediaView from '../../media/MediaView';
import ReactionsView from '../../posts/ReactionsView';
import Divider from '../../Divider';
import Icon from '../../Icon';
import ListView from '../../list/ListView';
import {IObject} from '~/interfaces/common';
import {borderRadius, margin, padding} from '~/theme/spacing';
import Text from '../../texts/Text';

const Post: React.FC<IObject<any>> = ({
  user,
  updatedAt,
  content,
  media,
  hashtags,
  isLike,
  locationName,
  reaction,
  reactionActions,
  maxLength = 200,
  showBackButton,
}) => {
  return (
    <ScreenWrapper style={styles.container}>
      <View>
        {user && (
          <HeaderView
            avatar={{user}}
            firstLabel={user.name}
            secondLabel={updatedAt}
            thirdLabel={locationName}
            showBackButton={showBackButton}
          />
        )}
      </View>

      <Text style={styles.content} maxLength={maxLength}>
        {content}
      </Text>

      {media && <MediaView {...media} />}

      {hashtags && (
        <ListView
          type="tag"
          data={hashtags}
          style={styles.hashtags}
          horizontal
        />
      )}

      {reaction && (
        <>
          <ReactionsView isLike={isLike} {...reaction} />
          <Divider thick={1} />
        </>
      )}

      <Icon
        style={styles.iconOptions}
        icon="iconOptions"
        size={18}
        tintColor="grey"
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
  },
  content: {
    marginBottom: margin.small,
    justifyContent: 'center',
    paddingHorizontal: padding.large,
  },
  hashtags: {
    marginHorizontal: margin.small,
    marginVertical: margin.small,
  },
  reactions: {
    paddingVertical: padding.small,
    justifyContent: 'space-between',
    paddingHorizontal: padding.large,
  },
  iconOptions: {
    position: 'absolute',
    top: margin.large,
    right: margin.large,
    zIndex: 99,
  },
});

export default Post;
