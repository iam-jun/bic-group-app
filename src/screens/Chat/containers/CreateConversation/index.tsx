import i18next from 'i18next';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import appConfig from '~/configs/appConfig';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import {ITheme} from '~/theme/interfaces';
import MembersSelection from '../../fragments/MembersSelection';
import actions from '../../redux/actions';

const CreateConversation = (): React.ReactElement => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing} = theme;

  const dispatch = useDispatch();
  const selectedUsers = useKeySelector('chat.selectedUsers');
  const users = useKeySelector('chat.users');
  const [searchQuery, setSearchQuery] = useState('');
  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    dispatch(actions.resetData('users'));
    dispatch(
      actions.getData(
        'users',
        {
          limit: appConfig.recordsPerPage,
        },
        'data',
      ),
    );
  }, []);

  const loadMoreData = () => dispatch(actions.mergeExtraData('users', 'data'));

  const onNextPress = () => {
    if (selectedUsers.length === 1)
      dispatch(actions.createConversation(selectedUsers));
    else rootNavigation.navigate(chatStack.reviewConversation);
  };

  const searchUsers = (searchQuery: string) => {
    dispatch(actions.resetData('users'));
    dispatch(
      actions.getData(
        'users',
        {
          key: searchQuery,
          limit: appConfig.recordsPerPage,
        },
        'data',
      ),
    );
  };

  const seachHandler = useCallback(
    debounce(searchUsers, appConfig.searchTriggerTime),
    [],
  );

  const onQueryChanged = (text: string) => {
    setSearchQuery(text);
    seachHandler(text);
  };

  return (
    <ScreenWrapper testID="CreateConversationScreen" isFullView>
      <Header
        title={i18next.t('chat:title_add_participants')}
        buttonText={i18next.t('common:btn_next')}
        buttonProps={{
          disabled: selectedUsers.length === 0,
        }}
        onPressButton={onNextPress}
      />
      <ViewSpacing height={spacing?.margin.base} />
      <MembersSelection
        selectable
        title={
          searchQuery
            ? i18next.t('common:text_search_results')
            : i18next.t('common:text_all')
        }
        loading={users.loading}
        data={users.data}
        searchInputProps={{
          onChangeText: onQueryChanged,
        }}
        onLoadMore={loadMoreData}
      />
    </ScreenWrapper>
  );
};

export default CreateConversation;
