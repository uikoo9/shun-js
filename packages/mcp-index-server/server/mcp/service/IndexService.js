// model
const { getMCPListFirstPage, getMCPTags, getMCPWords } = require('../model/MCPModel.js');

/**
 * index
 * @param {*} req
 * @param {*} res
 */
exports.index = async (req, res) => {
  // const
  const pagePath = './views/index.html';

  // is static
  const isStatic = await res.staticRender(pagePath);
  if (isStatic) return;

  // first page
  const firstPage = await getMCPListFirstPage(req);
  if (firstPage.type !== 'success') {
    res.json(firstPage);
    return;
  }

  // mcp tags
  const mcpTags = await getMCPTags(req);
  if (!mcpTags) {
    res.jsonFail('get mcp tags error');
    return;
  }

  // mcp words
  const mcpWords = await getMCPWords(req);
  if (!mcpWords) {
    res.jsonFail('get mcp words error');
    return;
  }

  // render
  const renderData = { mcps: firstPage.obj, mcpTags: mcpTags, mcpWords: mcpWords.map((item) => item.mcp_word_content) };
  res.render(
    pagePath,
    {
      data: renderData,
    },
    true,
  );
};
