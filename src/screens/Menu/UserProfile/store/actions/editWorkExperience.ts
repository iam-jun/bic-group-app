import showToastError from '~/store/helper/showToastError';
import { IUserAddWorkExperience } from '~/interfaces/IAuth';
import userApi from '~/api/UserApi';

const editWorkExperience = () => async (
  id: string,
  payload: IUserAddWorkExperience,
  callback?: () => void,
) => {
  try {
    const {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    } = payload;

    await userApi.editWorkExperience(id, {
      company,
      titlePosition,
      location,
      description,
      currentlyWorkHere,
      startDate,
      endDate,
    });

    callback && callback();
  } catch (err) {
    console.error('editWorkExperience error: ', err);
    showToastError(err);
  }
};

export default editWorkExperience;
