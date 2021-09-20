import _ from 'lodash';
import React, {useEffect} from 'react';
import {FlatList, FlatListProps} from 'react-native';

interface Props extends FlatListProps<any> {
  listRef?: React.MutableRefObject<FlatList> | null;
}

const ListMessages = ({listRef, ...props}: Props) => {
  // const listRef = useRef(null);
  useEffect(() => {
    // @ts-ignore
    const scroll = listRef.current && listRef.current.getScrollableNode();
    if (!scroll) return;
    // @ts-ignore
    const listener = scroll.addEventListener('wheel', e => {
      // @ts-ignore
      scroll.scrollTop -= e.deltaY;
      e.preventDefault();
    });
    // @ts-ignore
    scroll.current?.setNativeProps({
      style: {transform: 'translate3d(0,0,0) scaleY(-1)'},
    });

    // @ts-ignore
    return () => scroll.removeEventListener('wheel', listener);
  }, [listRef?.current]);

  useEffect(() => {
    const lM = document.getElementById('list-messages');
    const lClass = _.filter(lM?.classList, item => {
      return item.includes('scrollbarWidth');
    });
    if (lClass.length > 0) {
      lM?.classList.remove(lClass[0]);
    }
  });

  return (
    // <Div nativeID="chat-wrapper" onScroll={props.onScroll}>
    //   <Div nativeID="chat-container">
    <FlatList {...props} ref={listRef} />
    //   </Div>
    // </Div>
  );
};

export default ListMessages;
