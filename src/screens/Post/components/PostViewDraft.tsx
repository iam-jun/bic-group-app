import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import {IPostActivity} from '~/interfaces/IPost';
import PostViewHeader from '~/screens/Post/components/postView/PostViewHeader';
import PostViewContent from '~/screens/Post/components/postView/PostViewContent';
import PostViewImportant from '~/screens/Post/components/postView/PostViewImportant';
import Button from '~/beinComponents/Button';
import {useBaseHook} from '~/hooks';

export interface PostViewDraftProps {
  style?: StyleProp<ViewStyle>;
  data: IPostActivity;
  isPostDetail?: boolean;
}

const PostViewDraft: FC<PostViewDraftProps> = ({
  style,
  data,
  isPostDetail = false,
}: PostViewDraftProps) => {
  const [isImportant, setIsImportant] = useState(false);

  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {actor, audience, object, important, own_reactions, time} = data || {};

  const {content, images} = object?.data || {};

  const checkImportant = () => {
    const {active = false} = important || {};
    let notMarkAsRead = true;
    if (own_reactions?.mark_as_read?.length > 0) {
      notMarkAsRead = false;
    }
    setIsImportant(!!active && notMarkAsRead);
  };

  useEffect(() => {
    if (important && important.active) {
      checkImportant();
    }
  }, [important]);

  const onPressPost = () => {
    alert('post');
  };

  const onPressEdit = () => {
    alert('edit');
  };

  const onPressMenu = () => {
    alert('menu');
  };

  return (
    <View>
      <PostViewImportant
        isImportant={isImportant}
        expireTime={important?.expiresTime}
      />
      <View
        style={StyleSheet.flatten([
          styles.container,
          Platform.OS === 'web' && !isPostDetail ? styles.containerWeb : {},
          style,
        ])}>
        <PostViewHeader
          audience={audience}
          actor={actor}
          onPressMenu={onPressMenu}
          // onPressHeader={() => onPressHeader?.(postId)}
          // onPressShowAudiences={onPressShowAudiences}
        />
        <PostViewContent
          content={content}
          images={images}
          isPostDetail={isPostDetail}
        />
        <View style={styles.footerButtonContainer}>
          <Button.Secondary style={styles.footerButton} onPress={onPressPost}>
            {t('post:draft:btn_post_now')}
          </Button.Secondary>
          <Button.Secondary style={styles.footerButton} onPress={onPressEdit}>
            {t('post:draft:btn_edit')}
          </Button.Secondary>
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    containerWeb: {
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: colors.borderDivider,
      shadowOffset: {width: 0, height: 1},
      shadowColor: '#120F22',
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    footerButtonContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.tiny,
    },
    footerButton: {
      flex: 1,
      marginVertical: spacing.margin.small,
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default PostViewDraft;
