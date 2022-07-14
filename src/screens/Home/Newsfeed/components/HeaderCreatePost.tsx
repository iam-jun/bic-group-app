import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import menuActions from '~/screens/Menu/redux/actions';
import {useUserIdAuth} from '~/hooks/auth';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useRootNavigation} from '~/hooks/navigation';
import {ISelectAudienceParams} from '~/screens/Post/PostSelectAudience/SelectAudienceHelper';

export interface HeaderCreatePostProps {
  audience?: any;
  style?: StyleProp<ViewStyle>;
  createFromGroupId?: number;
}

const HeaderCreatePost: React.FC<HeaderCreatePostProps> = ({
  audience,
  style,
  createFromGroupId,
}: HeaderCreatePostProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const avatar = useKeySelector('menu.myProfile.avatar');

  const draftPost = useKeySelector(postKeySelector.draft.posts) || [];
  let draftCount = draftPost?.length || 0;
  if (draftCount > 9) {
    draftCount = '9+';
  }

  useEffect(() => {
    if (!avatar && userId) {
      dispatch(menuActions.getMyProfile({userId}));
    }
  }, [avatar]);

  const navigateToCreatePost = () => {
    let screen = homeStack.createPost;
    const params: ISelectAudienceParams = {createFromGroupId};
    if (audience) {
      params.initAudience = audience;
    }
    if (!createFromGroupId) {
      screen = homeStack.postSelectAudience;
      params.isFirstStep = true;
    }
    rootNavigation.navigate(screen, params as any);
  };

  const onPressCreate = () => {
    navigateToCreatePost();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        <Avatar.Medium isRounded={true} source={avatar} />
        <TouchableOpacity
          testID={'header_create_post'}
          onPress={onPressCreate}
          style={styles.buttonContainer}>
          <Text.BodyS color={colors.textTertiary} useI18n>
            {'post:create_new_post'}
          </Text.BodyS>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
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
    buttonRow: {
      marginTop: spacing.margin.large,
      flexDirection: 'row',
    },
    draftContainer: {
      minWidth: 20,
      height: 18,
      marginLeft: spacing.margin.small,
      borderRadius: spacing.borderRadius.large,
      backgroundColor: colors.borderCard,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default HeaderCreatePost;
