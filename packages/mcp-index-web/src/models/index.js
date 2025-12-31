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
}));
