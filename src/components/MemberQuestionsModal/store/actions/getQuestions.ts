import groupApi from '~/api/GroupApi';
import { IMemberQuestionsState } from '../index';

// const mockQuestions = [
//   {
//     id: 'string 1',
//     groupId: ' 1',
//     question: '1. What is the cross with the loop at the top?',
//     isRequired: true,
//     createdAt: 'string',
//     updatedAt: 'string',
//   },
//   {
//     id: 'string 2',
//     groupId: ' 1',
//     question: '2. What is the best courses to do after MBA marketing? What is the best courses t
// o do after MBA marketing? What is the best courses to do after MBA marketing?
// What is the best courses to do after MBA marketing?',
//     isRequired: true,
//     createdAt: 'string',
//     updatedAt: 'string',
//   },
//   {
//     id: 'string 3',
//     groupId: ' 1',
//     question: '3. What is the cross with the loop at the top?',
//     isRequired: false,
//     createdAt: 'string',
//     updatedAt: 'string',
//   },
//   {
//     id: 'string 4',
//     groupId: ' 1',
//     question: '4. What is the cross with the loop at the top?',
//     isRequired: false,
//     createdAt: 'string',
//     updatedAt: 'string',
//   }, {
//     id: 'string 5',
//     groupId: ' 1',
//     question: '5. What is the cross with the loop at the top?',
//     isRequired: false,
//     createdAt: 'string',
//     updatedAt: 'string',
//   },
// ];

const getQuestions = (set, _get) => async (groupId: string) => {
  try {
    set((state: IMemberQuestionsState) => {
      state.loading = true;
    }, 'getQuestions');
    const response = await groupApi.getMembershipQuestions(groupId);

    const newIds = response.data.map((item) => item.id);
    const newItems = response.data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    set((state: IMemberQuestionsState) => {
      state.loading = false;
      state.questions = newItems;
      state.ids = newIds;
      state.isOpen = true;
    }, 'getQuestionsSuccess');
  } catch (e) {
    console.error('\x1b[31m🐣️ action getQuestions error: ', e, '\x1b[0m');
    set((state: IMemberQuestionsState) => {
      state.loading = false;
      state.questions = {};
      state.ids = [];
    }, 'getQuestionsError');
  }
};
export default getQuestions;
