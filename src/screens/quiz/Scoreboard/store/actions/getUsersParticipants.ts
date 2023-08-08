import streamApi from '~/api/StreamApi';
import { IScoreboardState } from '../index';
import showToastError from '~/store/helper/showToastError';

const getUsersParticipants = (set, get) => async (quizId: string) => {
  try {
    const response = await streamApi.getUsersParticipants(quizId);

    set((state: IScoreboardState) => {
      
    }, 'getUsersParticipantSuccess');
  } catch (error) {
    console.error('\x1b[31m🐣️ action getUsersParticipants error: ', error, '\x1b[0m');
    showToastError(error);
  }
}

export default getUsersParticipants;
