// model
const { addMCPSearchDetail, getMCPDetailByCode } = require('../model/MCPModel.js');

// util
const { mcpDetailFeishuMsg } = require('../../util/feishu.js');

/**
 * detail
 * @param {*} req
 * @param {*} res
 */
exports.detail = async (req, res) => {
  const methodName = 'detail';

  // code
  const code = req.params.code;
  req.logger.info(methodName, 'code', code);
  if (!code) {
    req.logger.error(methodName, 'code redirect');
    res.redirect('https://mcp-servers.online/');
    return;
  }

  // feishu
  mcpDetailFeishuMsg(req);
  addMCPSearchDetail(req, code);

  // is static
  const pagePath = `./views/details/${code}.html`;
  const isStatic = await res.staticRender(pagePath);
  if (isStatic) return;

  // detail
  const detail = await getMCPDetailByCode(req, res, code);
  if (!detail) {
    req.logger.error(methodName, 'detail redirect');
    res.redirect('https://mcp-servers.online/');
    return;
  }

  // render
  const title = `${detail.mcp_item_code} | MCP服务器列表 | mcp-servers.online`;
  const desc = `${detail.mcp_item_desczh} | ${detail.mcp_item_desc} | MCP服务器列表 modelcontextprotocol mcp-servers.online`;
  res.render(
    './views/detail.html',
    {
      title: title,
      desc: desc,
      data: detail,
    },
    pagePath,
  );
};
