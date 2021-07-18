import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import HeaderView from '~/components/HeaderView';
import ScreenWrapper from '~/components/ScreenWrapper';
import MediaView from '~/components/media/MediaView';
import ReactionsView from './ReactionsView';
import Divider from '~/components/Divider';
import Icon from '~/beinComponents/Icon';
import Markdown from '~/components/texts/Markdown';
import {IObject} from '~/interfaces/common';
import spacing, {borderRadius, margin, padding} from '~/theme/spacing';
import commonActions, {IAction} from '~/constants/commonActions';
import ViewSpacing from '~/components/ViewSpacing';
import TagsView from '~/components/TagsView';

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
            style={styles.headerView}
          />
        )}
      </View>
      <ViewSpacing height={spacing.margin.base} />

      <Markdown style={styles.content} maxLength={maxLength}>
        {content}
      </Markdown>

      {media && <MediaView {...media} />}

      {hashtags && <TagsView style={styles.hashtags} data={hashtags} />}

      {reaction && (
        <>
          <ReactionsView isLike={isLike} {...reaction} />
          <Divider thick={1} />
          // TODO: Add reaction (like, comment, share) view here
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
  headerView: {
    marginStart: margin.large,
    paddingTop: padding.large,
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
