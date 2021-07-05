import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import HeaderView from '../../HeaderView';
import ScreenWrapper from '../../ScreenWrapper';
import MediaView from '../../media/MediaView';
import ReactionsView from '../../posts/ReactionsView';
import Divider from '../../Divider';
import Icon from '../../Icon';
import HorizontalListView from '../HorizontalListView';
import ListView from '../ListView';
import Markdown from '../../texts/Markdown';
import {IObject} from '~/interfaces/common';
import spacing, {borderRadius, margin, padding} from '~/theme/spacing';
import commonActions, {IAction} from '~/constants/commonActions';
import {IReactionAction} from './ReactionActionItem';
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
    <ScreenWrapper style={styles.container}>
      <View>
        {user && (
          <HeaderView
            avatar={{user}}
            firstLabel={user.name || user.fullName}
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
      <TouchableOpacity
        style={styles.iconOptions}
        onPress={() => _onActionPress(commonActions.openPostOption as IAction)}>
        <Icon icon="iconOptions" size={18} tintColor={theme.colors.text} />
      </TouchableOpacity>
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

export default PostItem;
