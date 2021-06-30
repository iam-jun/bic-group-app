import React from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderView from '../../Header/HeaderView';
import ThemeView from '../../ThemeView';
import MediaView from '../../Media/MediaView';
import ReactionsView from '../../Post/ReactionsView';
import Divider from '../../Divider';
import Icon from '../../Icon';
import HorizontalListView from '../HorizontalListView';
import ListView from '../ListView';
import Markdown from '../../Text/Markdown';
import {IObject} from '~/interfaces/common';
import spacing, {borderRadius, margin, padding} from '~/theme/configs/spacing';
import {IAction} from '~/constants/commonActions';
import {IReactionAction} from './ReactionActionItem';
import {useTheme} from 'react-native-paper';
import ViewSpacing from '../../ViewSpacing';

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
  const _onActionPress = (action: IAction) => {
    onActionPress && onActionPress(action);
  };

  const theme: IObject<any> = useTheme();

  return (
    <ThemeView style={styles.container}>
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
      <ViewSpacing height={spacing.margin.base} />

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
          <HorizontalListView
            style={styles.reactions}
            data={reactionActions}
            type="reactionActions"
            onItemPress={(item: IReactionAction) => {
              _onActionPress(`reaction-${item.type}` as IAction);
            }}
          />
        </>
      )}

      <Icon
        style={styles.iconOptions}
        icon="iconOptions"
        size={18}
        tintColor={theme.colors.text}
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
