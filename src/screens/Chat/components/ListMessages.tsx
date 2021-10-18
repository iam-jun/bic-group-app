import _ from 'lodash';
import React, {useEffect, useRef} from 'react';
import {FlatList, FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  listRef?: React.RefObject<FlatList> | null;
  onViewableItemsChanged: (changed: any) => void;
}

const ListMessages = ({listRef, onViewableItemsChanged, ...props}: Props) => {
  let initiated = false;
  // useRef doesn't work with state
  const _onViewableItemsChanged = useRef((event: any) => {
    if (!initiated) onViewableItemsChanged(event.changed);
    initiated = true;
  });

  useEffect(() => {
    const lM = document.getElementById('list-messages');

    const lClass = _.filter(lM?.classList, item => {
      return item.includes('scrollbarWidth');
    });

    if (lClass.length > 0) {
      lM?.classList.remove(lClass[0]);

      // const lClass = _.filter(lM?.classList, item => {

      //   return item.includes('scrollbarWidth');

      // });

      const classList = lM?.classList;

      if (classList && classList.length > 0) {
        lM?.classList.remove(classList[classList.length - 2]);
      }
    }
  }, []);

  return (
    <FlatList
      nativeID={'list-messages'}
      ref={listRef}
      {...props}
      onViewableItemsChanged={_onViewableItemsChanged.current}
    />
  );
};

export default ListMessages;
