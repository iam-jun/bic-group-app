import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import MentionBar from '~/beinComponents/inputs/MentionInput/MentionBar';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import { useRootNavigation } from '~/hooks/navigation';
import { IconType } from '~/resources/icons';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import modalActions from '~/storeRedux/modal/actions';

import spacing, { borderRadius } from '~/theme/spacing';

const EditArticleFooter = () => {
  const showMentionValue = useSharedValue(0);

  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const dispatch = useDispatch();

  const onPress = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDescription = () => {
    rootNavigation.navigate(articleStack.createArticleSummary);
  };

  const onPressCategory = () => {
    rootNavigation.navigate(articleStack.createArticleCategory);
  };

  const mentionContainerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: 0,
    left: 0,
    top: spacing.margin.base,
    flexDirection: 'row',
    opacity: showMentionValue.value,
  }));

  const onVisibleMentionBar = (isVisible: boolean) => {
    if (isVisible) {
      showMentionValue.value = withTiming(1);
    } else {
      showMentionValue.value = withTiming(0);
    }
  };

  const renderButton = (icon: IconType, onPress: any) => (
    <Button style={styles.button}>
      <Icon size={24} icon={icon} onPress={onPress} />
    </Button>
  );

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.centerLine} />
        <View style={styles.buttonContainer}>
          {renderButton('Users', onPress)}
          {renderButton('ImageLandscape', onPress)}
          {renderButton('InputText', onPressDescription)}
          {renderButton('ChartTreeMap', onPressCategory)}
        </View>
        <Animated.View style={mentionContainerStyle}>
          <MentionBar
            onVisible={onVisibleMentionBar}
            style={styles.mentionBar}
          />
        </Animated.View>
      </View>
      <KeyboardSpacer iosOnly avoidInsetsBottom />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderColor: colors.neutral5,
      paddingTop: spacing.padding.base,
      paddingBottom: insets.bottom,
      borderTopRightRadius: borderRadius.extraLarge,
      borderTopLeftRadius: borderRadius.extraLarge,
      width: '100%',
    },
    centerLine: {
      position: 'absolute',
      top: spacing.margin.tiny,
      alignSelf: 'center',
      width: 40,
      height: 3,
      borderRadius: borderRadius.small,
      backgroundColor: colors.gray20,
    },
    buttonContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
    },
    button: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mentionBar: {
      borderColor: colors.neutral5,
      borderTopWidth: 0,
    },
    bottomSafeArea: {
      marginBottom: insets.bottom,
    },
  });
};

export default EditArticleFooter;
