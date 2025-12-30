// react
import React, { useState, useEffect } from 'react';

// antd
import { Flex, Button, Popconfirm, Table, Modal, Input, Space, message } from 'antd';

// ajax
import { postWithToken } from '@util/fetch.js';

// constants
import { host } from '@util/constants.js';

/**
 * UcenterMenu
 */
export const UcenterMenu = () => {
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
  const [ucenterMenuParent, setUcenterMenuParent] = useState('');
  const [ucenterMenuSn, setUcenterMenuSn] = useState('');
  const [ucenterMenuTitle, setUcenterMenuTitle] = useState('');
  const [ucenterMenuUrl, setUcenterMenuUrl] = useState('');

  // effect
  useEffect(() => {
    list();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // reset
  const reset = () => {
    setRowKeys([]);
    setId('');
    setUcenterMenuParent('');
    setUcenterMenuSn('');
    setUcenterMenuTitle('');
    setUcenterMenuUrl('');
  };

  // list
  const list = async (page, pageSize, ucenterMenuParent, ucenterMenuSn, ucenterMenuTitle, ucenterMenuUrl) => {
    // options
    const options = {
      page: page || current || 1,
      rows: pageSize || pagesize || 10,
    };
    if (ucenterMenuParent) options.ucenterMenuParent = ucenterMenuParent;
    if (ucenterMenuSn) options.ucenterMenuSn = ucenterMenuSn;
    if (ucenterMenuTitle) options.ucenterMenuTitle = ucenterMenuTitle;
    if (ucenterMenuUrl) options.ucenterMenuUrl = ucenterMenuUrl;

    // list
    setLoading(true);
    const listDataRes = await postWithToken(`${host()}/ucenter/menu/list`, options);
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
    const delDataRes = await postWithToken(`${host()}/ucenter/menu/del`, {
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
    const getDataRes = await postWithToken(`${host()}/ucenter/menu/get`, {
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
    setUcenterMenuParent(String(item.ucenter_menu_parent));
    setUcenterMenuSn(item.ucenter_menu_sn);
    setUcenterMenuTitle(item.ucenter_menu_title);
    setUcenterMenuUrl(item.ucenter_menu_url);
  };

  // on save
  const onSave = async () => {
    // check
    // if (!ucenterMenuParent) {
    //   message.error('缺少必填项！');
    //   return;
    // }
    if (!ucenterMenuSn) {
      message.error('缺少必填项！');
      return;
    }
    if (!ucenterMenuTitle) {
      message.error('缺少必填项！');
      return;
    }
    if (!ucenterMenuUrl) {
      message.error('缺少必填项！');
      return;
    }

    // save
    const options = {
      ucenterMenuParent,
      ucenterMenuSn,
      ucenterMenuTitle,
      ucenterMenuUrl,
    };
    if (id) options.id = id;
    const saveDataRes = await postWithToken(`${host()}/ucenter/menu/save`, options);
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
    list(current, pagesize, ucenterMenuParent, ucenterMenuSn, ucenterMenuTitle, ucenterMenuUrl);
    setModalOpen(false);
  };

  // const
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },

    {
      title: 'ucenter_menu_parent',
      dataIndex: 'ucenter_menu_parent',
    },

    {
      title: 'ucenter_menu_sn',
      dataIndex: 'ucenter_menu_sn',
    },

    {
      title: 'ucenter_menu_title',
      dataIndex: 'ucenter_menu_title',
    },

    {
      title: 'ucenter_menu_url',
      dataIndex: 'ucenter_menu_url',
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
              placeholder="ucenterMenuParent"
              value={ucenterMenuParent}
              onChange={(e) => {
                setUcenterMenuParent(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="ucenterMenuSn"
              value={ucenterMenuSn}
              onChange={(e) => {
                setUcenterMenuSn(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="ucenterMenuTitle"
              value={ucenterMenuTitle}
              onChange={(e) => {
                setUcenterMenuTitle(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="ucenterMenuUrl"
              value={ucenterMenuUrl}
              onChange={(e) => {
                setUcenterMenuUrl(e.target.value);
              }}
            />
          </div>
        </Flex>
      </Modal>
    </div>
  );
};
