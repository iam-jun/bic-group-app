import React, {useRef} from 'react';
import {View} from 'react-native';

import BottomSheet from '~/beinComponents/BottomSheet';
import Text from '~/beinComponents/Text';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {useKeySelector} from '~/hooks/selector';
import {useDispatch} from 'react-redux';
import modalKeySelector from '~/store/modal/selectors';
import {clearReactionDetailBottomSheet} from '~/store/modal/actions';

const ReactionDetailBottomSheet = () => {
  const reactionSheetRef: any = useRef();

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;

  const data = useKeySelector(modalKeySelector.reactionDetailBottomSheet);
  const {isOpen} = data || {};

  console.log(
    `\x1b[34m🐣️ index ReactionDetailBottomSheet`,
    `${JSON.stringify(data, undefined, 2)}\x1b[0m`,
  );

  const _onClose = () => {
    console.log(`\x1b[36m🐣️ index _onClose\x1b[0m`);
    dispatch(clearReactionDetailBottomSheet());
  };

  return (
    <BottomSheet
      modalizeRef={reactionSheetRef}
      isOpen={isOpen}
      side="center"
      menuMinWidth={375}
      onClose={_onClose}
      ContentComponent={
        <View>
          <Text>ReactionBottomSheet</Text>
        </View>
      }
    />
  );
};

export default ReactionDetailBottomSheet;
