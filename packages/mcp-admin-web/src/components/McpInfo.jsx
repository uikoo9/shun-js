// react
import React, { useState, useEffect } from 'react';

// antd
import { Flex, Button, Popconfirm, Table, Modal, Input, Space, message } from 'antd';
const { TextArea } = Input;

// ajax
import { postWithToken } from '@util/fetch.js';

// constants
import { host } from '@util/constants.js';

/**
 * McpInfo
 */
export const McpInfo = () => {
  // state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [rowKeys, setRowKeys] = useState([]);
  const [searching, setSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加');
  const [id, setId] = useState('');
  const [mcpItemCode, setMcpItemCode] = useState('');
  const [mcpItemAuthor, setMcpItemAuthor] = useState('');
  const [mcpItemStars, setMcpItemStars] = useState('');
  const [mcpItemLanguage, setMcpItemLanguage] = useState('');
  const [mcpItemLicense, setMcpItemLicense] = useState('');
  const [mcpItemHomepage, setMcpItemHomepage] = useState('');
  const [mcpItemTag, setMcpItemTag] = useState('');
  const [mcpItemBranch, setMcpItemBranch] = useState('');
  const [mcpItemDesc, setMcpItemDesc] = useState('');
  const [mcpItemDesczh, setMcpItemDesczh] = useState('');
  const [mcpItemContent, setMcpItemContent] = useState('');
  const [mcpItemContentzh, setMcpItemContentzh] = useState('');
  const [updateDate, setUpdateDate] = useState('');

  // effect
  useEffect(() => {
    list();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // reset
  const reset = () => {
    setRowKeys([]);
    setId('');
    setMcpItemCode('');
    setMcpItemAuthor('');
    setMcpItemStars('');
    setMcpItemLanguage('');
    setMcpItemLicense('');
    setMcpItemHomepage('');
    setMcpItemBranch('');
    setMcpItemTag('');
    setMcpItemDesc('');
    setMcpItemDesczh('');
    setMcpItemContent('');
    setMcpItemContentzh('');
    setUpdateDate('');
  };

  // list
  const list = async (
    page,
    pageSize,
    mcpItemCode,
    mcpItemAuthor,
    mcpItemStars,
    mcpItemLanguage,
    mcpItemLicense,
    mcpItemHomepage,
    mcpItemBranch,
    mcpItemTag,
    mcpItemDesc,
    mcpItemDesczh,
    mcpItemContent,
    mcpItemContentzh,
    updateDate,
  ) => {
    // options
    const options = {
      page: page || current || 1,
      rows: pageSize || pagesize || 10,
    };
    if (mcpItemCode) options.mcpItemCode = mcpItemCode;
    if (mcpItemAuthor) options.mcpItemAuthor = mcpItemAuthor;
    if (mcpItemStars) options.mcpItemStars = mcpItemStars;
    if (mcpItemLanguage) options.mcpItemLanguage = mcpItemLanguage;
    if (mcpItemLicense) options.mcpItemLicense = mcpItemLicense;
    if (mcpItemHomepage) options.mcpItemHomepage = mcpItemHomepage;
    if (mcpItemBranch) options.mcpItemBranch = mcpItemBranch;
    if (mcpItemTag) options.mcpItemTag = mcpItemTag;
    if (mcpItemDesc) options.mcpItemDesc = mcpItemDesc;
    if (mcpItemDesczh) options.mcpItemDesczh = mcpItemDesczh;
    if (mcpItemContent) options.mcpItemContent = mcpItemContent;
    if (mcpItemContentzh) options.mcpItemContentzh = mcpItemContentzh;
    if (updateDate) options.updateDate = updateDate;

    // list
    const listDataRes = await postWithToken(`${host()}/mcp/info/list`, options);
    setLoading(false);
    if (listDataRes.type !== 'success') {
      message.error('获取列表数据失败！');
      return;
    }

    // obj
    const obj = listDataRes.obj;
    setData(
      obj.rows.map((row) => {
        row.key = row.id;
        row.item = row;
        return row;
      }),
    );

    // pagination
    setTotal(obj.total);
    setCurrent(obj.pagenumber);
    setPagesize(obj.pagesize);
  };

  // on del
  const onDel = async () => {
    if (!rowKeys.length) {
      message.error('请选择要删除的列！');
      return;
    }

    const ids = rowKeys.join(',');
    const delDataRes = await postWithToken(`${host()}/mcp/info/del`, {
      ids: ids,
    });
    if (delDataRes.type !== 'success') {
      message.error('删除数据失败！');
      return;
    }

    list();
    setRowKeys([]);
  };

  // get detail
  const getDetail = async (id) => {
    const getDataRes = await postWithToken(`${host()}/mcp/info/get`, {
      id: id,
    });
    if (getDataRes.type !== 'success') {
      message.error('获取数据失败！');
      return;
    }
    if (!getDataRes.obj || !getDataRes.obj.rows || !getDataRes.obj.rows.length) {
      message.error('获取数据失败！');
      return;
    }

    const item = getDataRes.obj.rows[0];
    setModalTitle('编辑');
    setModalOpen(true);
    setSearching(false);
    setId(id);
    setMcpItemCode(item.mcp_item_code);
    setMcpItemAuthor(item.mcp_item_author);
    setMcpItemStars(item.mcp_item_stars);
    setMcpItemLanguage(item.mcp_item_language);
    setMcpItemLicense(item.mcp_item_license);
    setMcpItemHomepage(item.mcp_item_homepage);
    setMcpItemBranch(item.mcp_item_branch);
    setMcpItemTag(item.mcp_item_tag);
    setMcpItemDesc(item.mcp_item_desc);
    setMcpItemDesczh(item.mcp_item_desczh);
    setMcpItemContent(item.mcp_item_content);
    setMcpItemContentzh(item.mcp_item_contentzh);
    setUpdateDate(item.update_date);
  };

  // on save
  const onSave = async () => {
    // check
    if (!mcpItemCode) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemAuthor) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemStars) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemLanguage) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemLicense) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemHomepage) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemBranch) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemTag) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemDesc) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemDesczh) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemContent) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpItemContentzh) {
      message.error('缺少必填项！');
      return;
    }
    if (!updateDate) {
      message.error('缺少必填项！');
      return;
    }

    // save
    const options = {
      mcpItemCode,
      mcpItemAuthor,
      mcpItemStars,
      mcpItemLanguage,
      mcpItemLicense,
      mcpItemHomepage,
      mcpItemBranch,
      mcpItemTag,
      mcpItemDesc,
      mcpItemDesczh,
      mcpItemContent,
      mcpItemContentzh,
      updateDate,
    };
    if (id) options.id = id;
    const saveDataRes = await postWithToken(`${host()}/mcp/info/save`, options);
    setModalOpen(false);
    if (saveDataRes.type !== 'success') {
      message.error('编辑数据失败！');
      return;
    }

    list();
    reset();
  };

  // on search
  const onSearch = async () => {
    list(
      current,
      pagesize,
      mcpItemCode,
      mcpItemAuthor,
      mcpItemStars,
      mcpItemLanguage,
      mcpItemLicense,
      mcpItemHomepage,
      mcpItemBranch,
      mcpItemTag,
      mcpItemDesc,
      mcpItemDesczh,
      mcpItemContent,
      mcpItemContentzh,
      updateDate,
    );
    setModalOpen(false);
  };

  // const
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },

    {
      title: 'mcp_item_code',
      dataIndex: 'mcp_item_code',
    },

    // {
    //   title: 'mcp_item_author',
    //   dataIndex: 'mcp_item_author',
    // },

    {
      title: 'mcp_item_stars',
      dataIndex: 'mcp_item_stars',
    },

    // {
    //   title: 'mcp_item_language',
    //   dataIndex: 'mcp_item_language',
    // },

    // {
    //   title: 'mcp_item_license',
    //   dataIndex: 'mcp_item_license',
    // },

    // {
    //   title: 'mcp_item_homepage',
    //   dataIndex: 'mcp_item_homepage',
    // },

    // {
    //   title: 'mcp_item_branch',
    //   dataIndex: 'mcp_item_branch',
    // },

    // {
    //   title: 'mcp_item_desc',
    //   dataIndex: 'mcp_item_desc',
    // },

    {
      title: 'mcp_item_desczh',
      dataIndex: 'mcp_item_desczh',
    },

    // {
    //   title: 'mcp_item_content',
    //   dataIndex: 'mcp_item_content',
    // },

    // {
    //   title: 'mcp_item_contentzh',
    //   dataIndex: 'mcp_item_contentzh',
    // },

    {
      title: 'update_date',
      dataIndex: 'update_date',
    },

    {
      title: '操作',
      dataIndex: 'id',
      render: (id) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                getDetail(id);
              }}
            >
              编辑
            </a>
          </Space>
        );
      },
    },
  ];

  // r
  return (
    <div>
      {/* tools */}
      <Flex gap="small" wrap>
        <Button
          type="primary"
          onClick={() => {
            setModalTitle('搜索');
            setModalOpen(true);
            setSearching(true);
          }}
        >
          搜索
        </Button>
        <Button
          type="primary"
          onClick={() => {
            reset();
            setModalTitle('添加');
            setModalOpen(true);
            setSearching(false);
          }}
        >
          添加
        </Button>
        <Popconfirm title="确认删除这些数据？" onConfirm={onDel} okText="是" cancelText="否">
          <Button danger>删除</Button>
        </Popconfirm>
      </Flex>

      {/* table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          total: total,
          current: current,
          pageSize: pagesize,
          position: ['bottomCenter'],
          pageSizeOptions: [10, 50, 100],
          onChange: list,
        }}
        rowSelection={{
          getCheckboxProps: (item) => ({
            name: item.id,
          }),
          onChange: (selectedRowKeys) => {
            setRowKeys(selectedRowKeys);
          },
        }}
      />

      {/* modal */}
      <Modal
        title={modalTitle}
        open={modalOpen}
        onOk={() => {
          searching ? onSearch() : onSave();
        }}
        onCancel={() => {
          setModalOpen(false);
          reset();
        }}
      >
        <Flex vertical gap={16}>
          <div>
            <Input
              type="text"
              placeholder="mcpItemCode"
              value={mcpItemCode}
              onChange={(e) => {
                setMcpItemCode(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemAuthor"
              value={mcpItemAuthor}
              onChange={(e) => {
                setMcpItemAuthor(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemStars"
              value={mcpItemStars}
              onChange={(e) => {
                setMcpItemStars(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemLanguage"
              value={mcpItemLanguage}
              onChange={(e) => {
                setMcpItemLanguage(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemLicense"
              value={mcpItemLicense}
              onChange={(e) => {
                setMcpItemLicense(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemHomepage"
              value={mcpItemHomepage}
              onChange={(e) => {
                setMcpItemHomepage(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemBranch"
              value={mcpItemBranch}
              onChange={(e) => {
                setMcpItemBranch(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpItemTag"
              value={mcpItemTag}
              onChange={(e) => {
                setMcpItemTag(e.target.value);
              }}
            />
          </div>

          <div>
            <TextArea
              placeholder="mcpItemDesc"
              value={mcpItemDesc}
              onChange={(e) => {
                setMcpItemDesc(e.target.value);
              }}
            />
          </div>

          <div>
            <TextArea
              placeholder="mcpItemDesczh"
              value={mcpItemDesczh}
              onChange={(e) => {
                setMcpItemDesczh(e.target.value);
              }}
            />
          </div>

          <div>
            <TextArea
              placeholder="mcpItemContent"
              value={mcpItemContent}
              onChange={(e) => {
                setMcpItemContent(e.target.value);
              }}
            />
          </div>

          <div>
            <TextArea
              placeholder="mcpItemContentzh"
              value={mcpItemContentzh}
              onChange={(e) => {
                setMcpItemContentzh(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="updateDate"
              value={updateDate}
              onChange={(e) => {
                setUpdateDate(e.target.value);
              }}
            />
          </div>
        </Flex>
      </Modal>
    </div>
  );
};
