import { cleanup } from '@testing-library/react-native';

afterEach(cleanup);

describe('Experiences screen', () => {
  // const data = [
  //   {
  //     id: '1',
  //     company: 'company',
  //     titlePosition: 'titlePosition',
  //     startDate: '2022-03-07T07:58:05.436Z',
  //     currentlyWorkHere: true,
  //     endDate: null,
  //     location: 'location',
  //   },
  // ];

  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   storeData = { ...initialState };
  //   storeData.menu.myProfile = {} as any;
  //   storeData.auth.user = {} as any;
  //   storeData.menu.userWorkExperience = [];
  // });

  // let storeData: any;

  // it('renders correctly', () => {
  //   const mockActionGetUserWorkExperience = () => ({
  //     type: menuTypes.SET_USER_PROFILE,
  //     payload: USER_PROFILE,
  //   });

  //   jest
  //     .spyOn(menuActions, 'getUserWorkExperience')
  //     .mockImplementation(mockActionGetUserWorkExperience as any);

  //   storeData.menu.userWorkExperience = data;

  //   const store = createTestStore(storeData);

  //   const wrapper = renderWithRedux(<Experiences />, store);
  //   expect(wrapper).toMatchSnapshot();
  // });

  // it('renders null', () => {
  //   const store = createTestStore(storeData);

  //   const wrapper = renderWithRedux(<Experiences />, store);
  //   expect(wrapper).toMatchSnapshot();
  // });
});
