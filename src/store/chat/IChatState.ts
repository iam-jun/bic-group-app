interface IChatState {
  unreadChannels: any,
  initChat: () => void,
  handleChatEvent: (userId: string, payload: any) => void
}

export default IChatState;
