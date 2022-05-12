import React, {FC} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Divider from '~/beinComponents/Divider';
import {IconType} from '~/resources/icons';
import Div from '~/beinComponents/Div';
import Button from '~/beinComponents/Button';
import * as modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';
import {IReactionCounts} from '~/interfaces/IPost';
import {blacklistReactions, ReactionType} from '~/constants/reactions';
import appConfig from '~/configs/appConfig';

export interface PostViewFooterProps {
  labelButtonComment: string;
  onAddReaction?: any;
  btnReactTestID?: string;
  btnCommentTestID?: string;
  onPressComment?: () => void;
  reactionCounts: IReactionCounts;
}

const validateReactionCount = (reactionCounts: any) => {
  let count = 0;
  Object.values(reactionCounts || {})?.map((reaction: any) => {
    const key = Object.keys(reaction || {})?.[0];
    if (!!key && !!reaction?.[key] && !blacklistReactions?.[key]) {
      count++;
    }
  });
  return count < appConfig.limitReactionCount;
};

const PostViewFooter: FC<PostViewFooterProps> = ({
  labelButtonComment,
  onAddReaction,
  btnReactTestID,
  btnCommentTestID,
  onPressComment,
  reactionCounts,
}: PostViewFooterProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing, dimension} = theme;
  const styles = createStyle(theme);

  const validReactionCount = validateReactionCount(reactionCounts);

  const onEmojiSelected = (emoji: string, key?: string) => {
    dispatch(modalActions.hideModal());
    if (key) {
      onAddReaction?.(key);
    }
  };

  const onPressReact = (event: any) => {
    const payload = {
      isOpen: true,
      ContentComponent: (
        <EmojiBoard
          width={Platform.OS === 'web' ? 320 : dimension.deviceWidth}
          height={280}
          onEmojiSelected={onEmojiSelected}
        />
      ),
      props: {
        webModalStyle: {minHeight: undefined},
        isContextMenu: true,
        position: {x: event?.pageX, y: event?.pageY},
        side: 'center',
      },
    };

    if (Platform.OS !== 'web') {
      dispatch(modalActions.showModal(payload));
      return;
    }

    // Handling show reaction bottom sheet on web
    // @ts-ignore
    event.target.measure((fx, fy, width, height, px, py) => {
      const buttonReactPaddingBottom = spacing.padding.tiny || 4;
      let x = px;
      let y = py + height + buttonReactPaddingBottom;

      /*
      As target may be the label, not the whole button itself,
      which causes the bottom sheet will render in the middle.
      If pressing on the label, the childElementCount will equal 0.
      */
      if (event.target.childElementCount !== 0) {
        x = x + width / 2;
      } else {
        // Move menu further down when pressing on label
        y = y + buttonReactPaddingBottom * 1.5;
      }
      payload.props.position = {x, y};

      dispatch(modalActions.showModal(payload));
    });
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
      <Div
        className="button-react"
        style={Platform.OS !== 'web' ? styles.buttonReactContainer : {}}>
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
            tintColor: colors.textSecondary,
          }}
          textProps={{
            variant: 'bodySM',
            color: colors.textSecondary,
          }}
          style={styles.buttonReact}>
          {title}
        </Button>
      </Div>
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
        'CommentAltDots',
        onPressComment,
        onPressComment,
        !onPressComment,
        btnCommentTestID,
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, dimension} = theme;
  return StyleSheet.create({
    container: {},
    reactButtons: {
      flexDirection: 'row',
      height: dimension?.commentBarHeight,
      borderTopWidth: 1,
      borderColor: colors.borderDivider,
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
