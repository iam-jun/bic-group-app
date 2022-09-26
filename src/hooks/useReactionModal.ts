import { MutableRefObject } from 'react';
import { IReactionBottomSheetRef } from '~/components/reaction/ReactionBottomSheet';

let reactionModalRef = null;

const useReactionModal = () => {
  const setRef = (ref: MutableRefObject<IReactionBottomSheetRef>) => {
    reactionModalRef = ref;
  };
  const open = (callback: (key: string)=> void) => {
    reactionModalRef?.current?.open(callback);
  };

  const close = () => {
    reactionModalRef?.current?.close();
  };

  return {
    setRef,
    open,
    close,
  };
};

export default useReactionModal;
