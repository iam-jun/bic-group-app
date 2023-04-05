import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Keyboard, NativeScrollEvent, LayoutChangeEvent,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  FadeInDown, FadeOutUp,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '~/beinComponents/Header';
import { dimension, spacing } from '~/theme';
import useTermStore from './store';
import { Button } from '~/baseComponents';
import MarkdownView from '~/beinComponents/MarkdownView';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import useCommunityController from '~/screens/communities/store';
import IDiscoverGroupsState from '~/screens/groups/DiscoverGroups/store/Interface';
import useDiscoverGroupsStore from '~/screens/groups/DiscoverGroups/store';

const GAP = 100;

const TermsView = () => {
  const theme: ExtendedTheme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);

  const actions = useTermStore((state) => state.actions);
  const content = useTermStore((state) => state.termContent);
  const loading = useTermStore((state) => state.loading);
  const type = useTermStore((state) => state.type);
  const groupId = useTermStore((state) => state.groupId);
  const rootGroupId = useTermStore((state) => state.rootGroupId);
  const name = useTermStore((state) => state.name);
  const isActiveGroupTerms = useTermStore((state) => state.isActiveGroupTerms);
  const isOpen = useTermStore((state) => state.isOpen);
  const resetTerms = useTermStore((state) => state.reset);

  const comActions = useCommunityController((state) => state.actions);
  const groupActions = useDiscoverGroupsStore((state:IDiscoverGroupsState) => state.actions);

  const [isAgree, setIsAgree] = useState(false);

  useEffect(() => {
    if (isActiveGroupTerms && rootGroupId) {
      actions.getTerms(rootGroupId);
    }
  }, [isActiveGroupTerms, rootGroupId]);

  useEffect(() => {
    if (!isOpen) {
      resetTerms();
      setIsAgree(false);
    } else {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const onClose = () => {
    actions.setIsOpen(false);
  };

  const onSubmit = () => {
    if (type === 'community') {
      comActions.joinCommunity(groupId, name);
    } else {
      groupActions.joinNewGroup(groupId);
    }
    actions.setIsOpen(false);
  };

  const onLayout = (e:LayoutChangeEvent) => {
    const contentHeight = e?.nativeEvent?.layout?.height || 0;
    if (contentHeight > 0 && contentHeight <= dimension.deviceHeight - GAP && !isAgree) {
      setIsAgree(true);
    }
  };

  const onScroll = (event: {nativeEvent: NativeScrollEvent}) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrollEnd = (layoutMeasurement.height + contentOffset.y) >= contentSize.height;
    if (isScrollEnd && !isAgree) {
      setIsAgree(true);
    }
  };

  if (!isOpen || !content) return null;

  return (
    <Animated.View
      testID="terms_view"
      style={styles.screenContainer}
      entering={FadeInDown}
      exiting={FadeOutUp}
    >
      <View style={styles.screenContainer}>
        <Header
          title={`common:text_${type}_terms`}
          titleTextProps={{ useI18n: true }}
          onPressBack={onClose}
        />
        <View style={styles.body}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            scrollEventThrottle={16}
            onLayout={onLayout}
            onScroll={onScroll}
          >
            {!!content && !loading
              ? (
                <MarkdownView testID="notification_content.description">
                  {content}
                </MarkdownView>
              )
              : <LoadingIndicator />}
          </ScrollView>
          <View style={styles.buttonView} testID="join_cancel_button">
            <Button.Secondary
              testID="terms_view.sumbit"
              useI18n
              disabled={!isAgree}
              onPress={onSubmit}
            >
              common:text_i_agree
            </Button.Secondary>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const createStyles = (theme: ExtendedTheme, insets: EdgeInsets) => {
  const { colors } = theme;

  return StyleSheet.create({
    screenContainer: {
      zIndex: 100,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
    },
    body: {
      flex: 1,
    },
    buttonsContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 271,
      marginTop: spacing.margin.extraLarge,
    },
    button: {
      marginVertical: spacing.margin.tiny,
    },
    buttonView: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.large + insets.bottom,
      paddingTop: spacing.padding.large,
    },
    checkbox: {
      marginTop: spacing.margin.large,
    },
    contentContainerStyle: {
      padding: spacing.padding.large,

    },
  });
};

export default TermsView;
