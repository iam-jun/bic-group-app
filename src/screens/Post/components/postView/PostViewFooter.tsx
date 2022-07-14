import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import {IReactionCounts} from '~/interfaces/IPost';
import {IconType} from '~/resources/icons';
import * as modalActions from '~/store/modal/actions';
import {validateReactionCount} from './helper';
import dimension from '~/theme/dimension';

export interface PostViewFooterProps {
  labelButtonComment: string;
  onAddReaction?: any;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  onPressComment?: () => void;
  reactionCounts: IReactionCounts;
}

const PostViewFooter: FC<PostViewFooterProps> = ({
  labelButtonComment,
  onAddReaction,
  btnReactTestID,
  btnCommentTestID,
  onPressComment,
  reactionCounts,
}: PostViewFooterProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const validReactionCount = validateReactionCount(reactionCounts);

  const onEmojiSelected = (emoji: string, key?: string) => {
    dispatch(modalActions.hideModal());
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = () => {
    const payload = {
      isOpen: true,
      ContentComponent: (
        <EmojiBoard
          width={dimension.deviceWidth}
          height={280}
          onEmojiSelected={onEmojiSelected}
        />
      ),
    };
    dispatch(modalActions.showModal(payload));
  };

  const renderReactButtonItem = (
    title: string,
    icon: IconType,
    onPress: any,
    onLongPress: any,
    disabled?: boolean,
    testID?: string,
  ) => {
    return (
      <View style={styles.buttonReactContainer}>
        <Button
          testID={testID}
          useI18n
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={disabled}
          leftIcon={icon}
          leftIconProps={{
            icon: icon,
            size: 14,
            tintColor: colors.gray50,
          }}
          textProps={{
            variant: 'bodySMedium',
            color: colors.gray50,
          }}
          style={styles.buttonReact}>
          {title}
        </Button>
      </View>
    );
  };

  return (
    <View style={styles.reactButtons}>
      {validReactionCount && (
        <>
          {renderReactButtonItem(
            'post:button_react',
            'iconReact',
            onPressReact,
            onPressReact,
            false,
            btnReactTestID,
          )}
          <Divider style={{height: '66%', alignSelf: 'center'}} horizontal />
        </>
      )}
      {renderReactButtonItem(
        labelButtonComment,
        'MessageDots',
        onPressComment,
        onPressComment,
        !onPressComment,
        btnCommentTestID,
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    reactButtons: {
      flexDirection: 'row',
      height: dimension?.commentBarHeight,
      borderTopWidth: 1,
      borderColor: colors.neutral5,
      alignItems: 'center',
    },
    buttonReactContainer: {
      flex: 1,
      height: 'auto',
    },
    buttonReact: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default PostViewFooter;
