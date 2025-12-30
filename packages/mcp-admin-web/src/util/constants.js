export const host = () => {
  return window.location.href.indexOf('localhost') > -1 ? 'http://localhost:7001' : 'https://admin.mcp-servers.online';
};
