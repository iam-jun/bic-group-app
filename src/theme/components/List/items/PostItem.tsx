import React from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderView from '../../Header/HeaderView';
import ThemeView from '../../ThemeView';
import MediaView from '../../Media/MediaView';
import ReactionsView from '../../Post/ReactionsView';
import Divider from '../../Divider';
import Icon from '../../Icon';
import HorizontalListContent from '../HorizontalListContent';
import ListView from '../ListView';
import Markdown from '../../Text/Markdown';
import {IObject} from '~/interfaces/common';
import {borderRadius, margin, padding} from '~/theme/configs/spacing';
import {ReactionAction} from '~/screens/Home';

const PostItem: React.FC<IObject<any>> = ({
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
  onActionPress,
}) => {
  const _onActionPress = (action: ReactionAction) => {
    onActionPress && onActionPress(action);
  };

  return (
    <ThemeView style={styles.container}>
      <View>
        {user && (
          <HeaderView
            avatar={{user}}
            firstLabel={user.fullName}
            secondLabel={updatedAt}
            thirdLabel={locationName}
            showBackButton={showBackButton}
          />
        )}
      </View>

      <Markdown style={styles.content} maxLength={maxLength}>
        {content}
      </Markdown>

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
          <HorizontalListContent
            style={styles.reactions}
            data={reactionActions}
            onPress={item => {
              _onActionPress(`reaction-${item.type}`);
            }}
          />
        </>
      )}

      <Icon
        style={styles.iconOptions}
        icon="iconOptions"
        size={18}
        tintColor="grey"
      />
    </ThemeView>
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

export default PostItem;
