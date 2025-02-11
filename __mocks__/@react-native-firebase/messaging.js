const messaging = jest.fn(() => ({
  hasPermission: jest.fn(() => Promise.resolve(true)),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve('myMockToken')),
  onTokenRefresh: jest.fn(() => Promise.resolve('myMockToken')),
  deleteToken: jest.fn(() => Promise.resolve(true)),
}));
export default messaging;
