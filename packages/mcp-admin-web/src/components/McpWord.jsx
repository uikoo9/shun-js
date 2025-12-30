// react
import React, { useState, useEffect } from 'react';

// antd
import { Flex, Button, Popconfirm, Table, Modal, Input, Space, message } from 'antd';

// ajax
import { postWithToken } from '@util/fetch.js';

// constants
import { host } from '@util/constants.js';

/**
 * McpWord
 */
export const McpWord = () => {
  // state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(1000);
  const [rowKeys, setRowKeys] = useState([]);
  const [searching, setSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('添加');
  const [id, setId] = useState('');
  const [mcpWordContent, setMcpWordContent] = useState('');
  const [mcpWordOrder, setMcpWordOrder] = useState('');

  // effect
  useEffect(() => {
    list();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // reset
  const reset = () => {
    setRowKeys([]);
    setId('');
    setMcpWordContent('');
    setMcpWordOrder('');
  };

  // list
  const list = async (page, pageSize, mcpWordContent, mcpWordOrder) => {
    // options
    const options = {
      page: page || current || 1,
      rows: pageSize || pagesize || 10,
    };
    if (mcpWordContent) options.mcpWordContent = mcpWordContent;
    if (mcpWordOrder) options.mcpWordOrder = mcpWordOrder;

    // list
    const listDataRes = await postWithToken(`${host()}/mcp/word/list`, options);
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
    const delDataRes = await postWithToken(`${host()}/mcp/word/del`, {
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
    const getDataRes = await postWithToken(`${host()}/mcp/word/get`, {
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
    setMcpWordContent(item.mcp_word_content);
    setMcpWordOrder(item.mcp_word_order);
  };

  // on save
  const onSave = async () => {
    // check
    if (!mcpWordContent) {
      message.error('缺少必填项！');
      return;
    }
    if (!mcpWordOrder) {
      message.error('缺少必填项！');
      return;
    }

    // save
    const options = {
      mcpWordContent,
      mcpWordOrder,
    };
    if (id) options.id = id;
    const saveDataRes = await postWithToken(`${host()}/mcp/word/save`, options);
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
    list(current, pagesize, mcpWordContent, mcpWordOrder);
    setModalOpen(false);
  };

  // const
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },

    {
      title: 'mcp_word_content',
      dataIndex: 'mcp_word_content',
    },

    {
      title: 'mcp_word_order',
      dataIndex: 'mcp_word_order',
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
              placeholder="mcpWordContent"
              value={mcpWordContent}
              onChange={(e) => {
                setMcpWordContent(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="mcpWordOrder"
              value={mcpWordOrder}
              onChange={(e) => {
                setMcpWordOrder(e.target.value);
              }}
            />
          </div>
        </Flex>
      </Modal>
    </div>
  );
};
