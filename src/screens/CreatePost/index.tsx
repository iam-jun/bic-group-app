import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import NavigationHeader from '~/components/headers/NavigationHeader';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import HorizontalView from '~/components/layout/HorizontalView';
import {margin, padding} from '~/theme/spacing';
import ListView from '~/beinComponents/list/ListView';
import createPostToolbar from '~/constants/createPostToolbar';
import {useBaseHook} from '~/hooks';
import {Text} from '~/components';
import {IObject} from '~/interfaces/common';
import Divider from '~/components/Divider';
import {homeStack, mainStack} from '~/configs/navigator';
import useAudience from '~/hooks/audience';
import audienceActions from './SelectAudience/redux/actions';
import postActions from './redux/actions';

const CreatePostView = ({navigation}: {navigation: any}) => {
  const {t} = useBaseHook();
  const [text, setText] = useState<string>('');
  const theme: IObject<any> = useTheme();
  const {audiences} = useAudience();
  const dispatch = useDispatch();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScreenWrapper isFullView testID="CreatePostScreen">
        <NavigationHeader
          isFullView
          isDefault
          title={t('post:create_post')}
          rightComponent={
            <PrimaryButton
              contentStyle={styles.button}
              disabled={!!text && audiences.data.length !== 0 ? false : true}
              testID="CreatePost"
              title={t('post:post_button')}
              onPress={() => {
                dispatch(
                  postActions.selectPost({
                    content: text,
                    reaction: {like: 0, comment: 0, share: 0},
                    isLike: true,
                  }),
                );
                dispatch(audienceActions.setAudiences([]));
                navigation.navigate(homeStack.postDetail);
              }}
            />
          }
        />
        <HorizontalView>
          <Text style={styles.sendTo} bold>
            {t('post:send_to')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(mainStack.selectPostAudience)}
            style={[
              styles.chooseAudience,
              {backgroundColor: theme.colors.tag},
            ]}>
            <Text primary={{color: theme.colors.purple}}>
              {t('post:choose_group_people')}
            </Text>
          </TouchableOpacity>
        </HorizontalView>

        {audiences.data.length !== 0 && (
          <ListView
            contentContainerStyle={{
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
            style={styles.audienceList}
            type="tag"
            data={audiences.data}
          />
        )}
        <Divider thick={1} />

        <ScrollView>
          <TextInput
            placeholder={t('post:placeholder_write_post')}
            value={text}
            onChangeText={text => setText(text)}
            multiline
            autoFocus={true}
            style={styles.textContent}
          />
        </ScrollView>
        <View style={styles.actionList}>
          <Divider thick={1} />
          <ListView data={createPostToolbar} type="option" />
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default CreatePostView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'space-between',
  },
  sendTo: {
    marginHorizontal: margin.big,
    marginVertical: margin.base,
  },
  chooseAudience: {
    marginHorizontal: margin.small,
    marginVertical: margin.base,
    borderRadius: 50,
    paddingHorizontal: padding.base,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    minHeight: 500,
    marginVertical: margin.base,
    marginHorizontal: margin.big,
  },
  button: {
    height: 35,
  },
  actionList: {
    justifyContent: 'flex-end',
    marginVertical: margin.big,
  },
  audienceList: {
    marginBottom: margin.large,
    marginHorizontal: margin.large,
  },
});
