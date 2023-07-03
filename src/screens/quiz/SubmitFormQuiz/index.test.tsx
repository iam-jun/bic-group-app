import React from 'react';
import { act, fireEvent, render, renderHook, renderWithRedux, waitFor } from '~/test/testUtils';
import SubmitFormQuiz from '.';
import MockedNavigator from '~/test/MockedNavigator';
import usePostsStore from '~/store/entities/posts';
import { postWithQuiz } from '~/test/mock_data/quiz';
import { IPost } from '~/interfaces/IPost';
import groupApi from '~/api/GroupApi';
import useModalStore from '~/store/modal';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '~/beinComponents/inputs/TextInput';
import { View } from 'react-native';

describe('SubmitFormQuiz', () => {
    jest.unmock('react-hook-form');

  it('should render correctly', async () => {
    // const { result } = renderHook(() => usePostsStore());
    // act(() => {
    //   result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
    // });

    // const wrapper = renderWithRedux(<MockedNavigator 
    // component={() => <SubmitFormQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />} />);

    //     await waitFor(() => {
    //    wrapper.getByTestId('title_description_section.title');
    // }, {
    //     timeout: 2000
    // })

    // expect(wrapper).toMatchSnapshot();

    const Component = () => {
      const { control } = useForm();
      return (
        <Controller
          defaultValue=""
          name="test"
          render={({ field }) =>  <TextInput
        testID="title_description_section.title"
        {...field}
      />}
          control={control}
        />
      );
    };

    const w = render(<Component />);
     await waitFor(() => {
        console.log('haizz', w.debug())
       w.getByTestId('title_description_section.title');
    })

  });

//   it('should show alert when user doesnt have permission', async () => {
//     jest.spyOn(groupApi, 'getMyPermissions').mockImplementation(
//       () => Promise.resolve({ data: {
//         communities: {},
//         groups: {},
//       },}) as any,
//     );

//     const { result } = renderHook(() => usePostsStore());
//     act(() => {
//       result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
//     });

//     const wrapper = renderWithRedux(<MockedNavigator 
// component={() => <SubmitFormQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />} />);

//     let inputTitle;
//     await waitFor(() => {
//        inputTitle = wrapper.getByTestId('title_description_section.title');
//     })

//     fireEvent.changeText(inputTitle, 'title');

//     const btnNext = wrapper.getByTestId('header.button');

//     await waitFor(() => {
//         expect(btnNext.props.disabled).toBeFalsy();
//     })

//     fireEvent.press(btnNext);

//     await waitFor(() => {
//       expect(useModalStore.getState().alert.visible).toBeTruthy();
//     });
//   });

//    it('should show alert when user press back', async () => {
//     const { result } = renderHook(() => usePostsStore());
//     act(() => {
//       result.current.actions.addToPosts({ data: postWithQuiz.data as IPost });
//     });

//     const wrapper = renderWithRedux(<MockedNavigator 
// component={() => <SubmitFormQuiz route={{ params: { postId: '54f4a2eb-034d-4e4e-8810-44744bffc87d' } }} />} />);

//     const inputTitle = wrapper.getByTestId('title_description_section.title');

//     fireEvent.changeText(inputTitle, 'title');

//     const btnBack = wrapper.getByTestId('header.back');

//     fireEvent.press(btnBack);

//     await waitFor(() => {
//       expect(useModalStore.getState().alert.visible).toBeTruthy();
//     });
//   });
});
