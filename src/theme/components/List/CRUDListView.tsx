import React, {useEffect} from 'react';

import _ from 'lodash';

import ListView from './ListView';
import useCRUDList from '~/hooks/CRUDList';
import {useDispatch} from 'react-redux';
import actions from '~/store/CRUDList/actions';

export interface CRUDListView {
  dataType: string;
  listType: string;
  [x: string]: any;
}

const CRUDListView: React.FC<CRUDListView> = ({
  dataType,
  listType,
  ...props
}) => {
  const list = useCRUDList(dataType);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getData(dataType, listType));
  }, []);

  const onScrollEnd = () => {
    dispatch(actions.mergeExtraData(dataType, listType));
  };

  const onRefresh = () => {
    dispatch(actions.refresh(dataType, listType));
  };

  return (
    <ListView
      {...props}
      type={listType}
      {...list}
      onEndReachedThreshold={0.1}
      onEndReached={onScrollEnd}
      onRefresh={onRefresh}
    />
  );
};

export default React.memo(CRUDListView);
