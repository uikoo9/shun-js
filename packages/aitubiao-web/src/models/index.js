// zustand
import { create } from 'zustand';

/**
 * store
 */
export const store = create((set) => ({
  // index
  total: 0,
  setTotal: (total) => set({ total: total }),
  mcpServers: [],
  setMCPServers: (mcpServers) => set({ mcpServers: mcpServers }),
  mcpPage: 1,
  setMCPPage: (mcpPage) => set({ mcpPage: mcpPage }),
  mcpTotal: 0,
  setMCPTotal: (mcpTotal) => set({ mcpTotal: mcpTotal }),
  searchWord: '',
  setSearchWord: (searchWord) => set({ searchWord: searchWord }),
  tag: '',
  setTag: (tag) => set({ tag: tag }),

  // login
  showLoginModal: false,
  setShowLoginModal: (showLoginModal) => set({ showLoginModal: showLoginModal }),

  // sidebar
  chatList: [],
  setChatList: (chatList) => set({ chatList: chatList }),

  // chat
  chatMsgs: [],
  setChatMsgs: (chatMsgs) => set({ chatMsgs: chatMsgs }),
  appendLastMsg: (text) =>
    set((state) => {
      const newChatMsgs = [...state.chatMsgs];
      newChatMsgs[newChatMsgs.length - 1] = {
        ...newChatMsgs[newChatMsgs.length - 1],
        msg: newChatMsgs[newChatMsgs.length - 1].msg + text,
      };
      return { chatMsgs: newChatMsgs };
    }),
  appendLastImg: (text) =>
    set((state) => {
      const newChatMsgs = [...state.chatMsgs];
      newChatMsgs[newChatMsgs.length - 1] = {
        ...newChatMsgs[newChatMsgs.length - 1],
        img: text,
      };
      return { chatMsgs: newChatMsgs };
    }),
}));
