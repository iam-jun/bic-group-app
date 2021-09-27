import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Avatar from '~/beinComponents/Avatar';
import Button from '~/beinComponents/Button';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import {useBaseHook} from '~/hooks';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import menuActions from '~/screens/Menu/redux/actions';
import {useUserIdAuth} from '~/hooks/auth';
import {ICreatePostParams} from '~/interfaces/IPost';

export interface HeaderCreatePostProps {
  audience?: any;
  style?: StyleProp<ViewStyle>;
  parentWidth?: number;
}

const HeaderCreatePost: React.FC<HeaderCreatePostProps> = ({
  audience,
  style,
  parentWidth,
}: HeaderCreatePostProps) => {
  const dispatch = useDispatch();
  const {navigation} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const {colors, dimension} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();
  const avatar = useKeySelector('menu.myProfile.avatar');

  useEffect(() => {
    if (!avatar) {
      dispatch(menuActions.getMyProfile({userId}));
    }
  }, [avatar]);

  const onPressCreate = () => {
    const params: ICreatePostParams = {};
    if (audience) {
      params.initAudience = audience;
    }
    navigation.navigate(homeStack.createPost, params);
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        parentWidth && parentWidth > dimension.maxNewsfeedWidth
          ? styles.containerForBigParent
          : {},
        style,
      ])}>
      <Avatar.Medium isRounded={true} source={avatar} />
      <Button
        TouchableComponent={TouchableHighlight}
        onPress={onPressCreate}
        underlayColor={colors.bgHover}
        style={styles.buttonContainer}>
        <Text.Body
          color={colors.textSecondary}
          useI18n
          style={styles.textStyle}>
          {'post:create_new_post'}
        </Text.Body>
        <Icon tintColor={colors.primary7} icon={'Edit'} />
      </Button>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors, dimension} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: spacing?.padding.base,
      paddingBottom: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
      // shadowColor: '#000',
      // shadowOpacity: 0.1,
      // shadowRadius: 1,
      // elevation: 2,
    },
    containerForBigParent: {
      ...Platform.select({
        web: {
          width: '100%',
          maxWidth: dimension.maxNewsfeedWidth,
          alignSelf: 'center',
          borderRadius: 6,
        },
      }),
    },
    buttonContainer: {
      flex: 1,
      marginLeft: spacing?.margin.base,
      backgroundColor: colors.borderDivider,
      justifyContent: 'center',
      paddingHorizontal: spacing?.padding.base,
      borderRadius: 20,
    },
    textStyle: {
      flex: 1,
      marginLeft: spacing?.margin.base,
    },
  });
};

export default HeaderCreatePost;
