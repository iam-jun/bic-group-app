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
import HorizontalView from '~/components/layout/HorizontalView';
import {margin, padding} from '~/theme/spacing';
import ListView from '~/beinComponents/list/ListView';
import createPostToolbar from '~/constants/createPostToolbar';
import {useBaseHook} from '~/hooks';
import {Text} from '~/components';
import Divider from '~/components/Divider';
import {homeStack, mainStack} from '~/configs/navigator';
import useAudience from '~/hooks/audience';
import audienceActions from './SelectAudience/redux/actions';
import postActions from './redux/actions';
import Header from '~/beinComponents/Header';
import {ITheme} from '~/theme/interfaces';

const CreatePostView = ({navigation}: {navigation: any}) => {
  const {t} = useBaseHook();
  const [text, setText] = useState<string>('');
  const theme: ITheme = useTheme();
  const {colors} = theme;
  const {audiences} = useAudience();
  const dispatch = useDispatch();

  const disableButtonPost = true;

  const onPressPost = () => {
    dispatch(
      postActions.selectPost({
        content: text,
        reaction: {like: 0, comment: 0, share: 0},
        isLike: true,
      }),
    );
    dispatch(audienceActions.setAudiences([]));
    navigation.navigate(homeStack.postDetail);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScreenWrapper isFullView testID="CreatePostScreen">
        <Header
          titleTextProps={{useI18n: true}}
          title={'post:create_post'}
          buttonText={'post:post_button'}
          buttonProps={{
            disabled: disableButtonPost,
            color: colors.primary7,
            textColor: colors.textReversed,
            useI18n: true,
          }}
          onPressButton={onPressPost}
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
