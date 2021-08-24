import React, {useRef} from 'react';
import {View} from 'react-native';

import BottomSheet from '~/beinComponents/BottomSheet';
import {IReactionProps} from '~/interfaces/IReaction';
import SelectReactionView from '~/beinFragments/reaction/SelectReactionView';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';

const ReactionBottomSheet = () => {
  const reactionSheetRef: any = useRef();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;

  const data = useKeySelector(postKeySelector.reactionBottomSheet);
  const {title, show, callback} = data || {};

  const _onPressReaction = (reaction: IReactionProps) => {
    reactionSheetRef?.current?.close?.();
    callback?.(reaction.id);
  };

  const _onClose = () => {
    dispatch(postActions.setShowReactionBottomSheet());
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={show}
      onClose={_onClose}
      ContentComponent={
        <View>
          {!!title && (
            <Text.H6
              style={{
                paddingHorizontal: spacing.padding.large,
                paddingTop: spacing.padding.small,
              }}
              color={colors.textSecondary}>
              {title}
            </Text.H6>
          )}
          <SelectReactionView onPressReaction={_onPressReaction} />
        </View>
      }
    />
  );
};

export default ReactionBottomSheet;
