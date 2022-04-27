import {takeLatest} from 'redux-saga/effects';
import menuTypes from '../types';
import deleteWorkExperience from './deleteWorkExperience';
import getMyWorkExperience from './getMyWorkExperience';
import addWorkExperience from './addWorkExperience';
import editWorkExperience from './editWorkExperience';
import getWorkExperience from './getWorkExperience';
import getUserProfile from './getUserProfile';
import getMyProfile from './getMyProfile';
import editMyProfile from './editMyProfile';
import uploadImage from './uploadImage';

export default function* menuSaga() {
  yield takeLatest(menuTypes.GET_USER_PROFILE, getUserProfile);
  yield takeLatest(menuTypes.GET_MY_PROFILE, getMyProfile);
  yield takeLatest(menuTypes.EDIT_MY_PROFILE, editMyProfile);
  yield takeLatest(menuTypes.UPLOAD_IMAGE, uploadImage);
  yield takeLatest(menuTypes.GET_MY_WORK_EXPERIENCE, getMyWorkExperience);
  yield takeLatest(menuTypes.ADD_WORK_EXPERIENCE, addWorkExperience);
  yield takeLatest(menuTypes.EDIT_WORK_EXPERIENCE, editWorkExperience);
  yield takeLatest(menuTypes.DELETE_WORK_EXPERIENCE, deleteWorkExperience);
  yield takeLatest(menuTypes.GET_USER_WORK_EXPERIENCE, getWorkExperience);
}
