import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme, ExtendedTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Avatar from '~/baseComponents/Avatar';
import Text from '~/beinComponents/Text';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { useKeySelector } from '~/hooks/selector';
import menuActions from '~/screens/Menu/redux/actions';
import { useUserIdAuth } from '~/hooks/auth';
import postKeySelector from '~/screens/Post/redux/keySelector';
import { useRootNavigation } from '~/hooks/navigation';
import { ISelectAudienceParams } from '~/screens/Post/PostSelectAudience/SelectAudienceHelper';
import spacing from '~/theme/spacing';

export interface HeaderCreatePostProps {
  audience?: any;
  style?: StyleProp<ViewStyle>;
  createFromGroupId?: string;
}

const HeaderCreatePost: React.FC<HeaderCreatePostProps> = ({
  audience,
  style,
  createFromGroupId,
}: HeaderCreatePostProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const avatar = useKeySelector('menu.myProfile.avatar');

  const draftPost = useKeySelector(postKeySelector.draft.posts) || [];
  let draftCount = draftPost?.length || 0;
  if (draftCount > 9) {
    draftCount = '9+';
  }

  useEffect(
    () => {
      if (!avatar && userId) {
        dispatch(menuActions.getMyProfile({ userId }));
      }
    }, [avatar],
  );

  const navigateToCreatePost = () => {
    let screen = homeStack.createPost;
    const params: ISelectAudienceParams = { createFromGroupId };
    if (audience) {
      params.initAudience = audience;
    }
    if (!createFromGroupId) {
      screen = homeStack.postSelectAudience;
      params.isFirstStep = true;
    }
    rootNavigation.navigate(
      screen, params as any,
    );
  };

  const onPressCreate = () => {
    navigateToCreatePost();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        <Avatar.Base isRounded source={avatar} />
        <TouchableOpacity
          testID="header_create_post"
          onPress={onPressCreate}
          style={styles.buttonContainer}
        >
          <Text.BodyS color={colors.gray60} useI18n>
            post:create_new_post
          </Text.BodyS>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.white,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonContainer: {
      flex: 1,
      marginLeft: spacing?.margin.large,
      justifyContent: 'center',
    },
  });
};

export default HeaderCreatePost;
