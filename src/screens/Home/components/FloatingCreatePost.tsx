import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useRootNavigation } from '~/hooks/navigation';

import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import { ISelectAudienceParams } from '~/screens/post/PostSelectAudience/SelectAudienceHelper';
import spacing from '~/theme/spacing';
import modalActions from '~/storeRedux/modal/actions';
import { useBaseHook } from '~/hooks';
import useDraftPostStore from '~/screens/post/DraftPost/store';

export interface FloatingCreatePostProps {
  audience?: any;
  createFromGroupId?: string;
}

const FloatingCreatePost: FC<FloatingCreatePostProps> = ({
  audience,
  createFromGroupId,
}: FloatingCreatePostProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const {
    total, actions,
  } = useDraftPostStore();

  useEffect(() => {
    actions.getDraftPosts({});
  }, []);

  const onCreate = () => {
    dispatch(modalActions.hideBottomList());
    const params: ISelectAudienceParams = {
      createFromGroupId,
      isFirstStep: true,
    };
    if (audience) {
      params.initAudience = audience;
    }
    rootNavigation.navigate(
      homeStack.postSelectAudience, params as any,
    );
  };

  const goToDraftPost = () => {
    dispatch(modalActions.hideBottomList());
    rootNavigation.navigate(
      homeStack.draftPost,
    );
  };

  const onPress = () => {
    const data = [{
      id: 1,
      testID: 'create_option.write_post',
      title: t('home:create_content_options:write_post'),
      onPress: onCreate,
    }, {
      id: 2,
      testID: 'create_option.write_series',
      title: t('home:create_content_options:write_series'),
      onPress: onCreate,
    },
    {
      id: 3,
      testID: 'create_option.my_draft',
      title: t('home:create_content_options:my_draft'),
      badge: total >= 100 ? '99+' : total > 0 ? total : '',
      style: styles.myDraft,
      onPress: goToDraftPost,
    }];
    dispatch(
      modalActions.showBottomList({ isOpen: true, data } as any),
    );
  };

  return (
    <View style={styles.container}>
      <Button onPress={onPress} style={styles.button}>
        <Icon tintColor={colors.white} width={20} height={20} icon="edit" />
      </Button>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      position: 'absolute',
      right: spacing.margin.small,
      bottom: spacing.margin.extraLarge,
    },
    button: {
      width: 44,
      height: 44,
      borderRadius: 4,
      backgroundColor: colors.purple60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    myDraft: {
      justifyContent: 'space-between',
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
  });
};

export default FloatingCreatePost;
