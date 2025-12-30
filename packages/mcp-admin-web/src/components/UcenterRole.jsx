// react
import React, { useState, useEffect } from 'react';

// antd
import { Flex, Button, Popconfirm, Table, Modal, Input, Space, message } from 'antd';

// ajax
import { postWithToken } from '@util/fetch.js';

// constants
import { host } from '@util/constants.js';

/**
 * UcenterRole
 */
export const UcenterRole = () => {
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
  const [ucenterRoleName, setUcenterRoleName] = useState('');
  const [ucenterRoleUrl, setUcenterRoleUrl] = useState('');

  // effect
  useEffect(() => {
    list();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // reset
  const reset = () => {
    setRowKeys([]);
    setId('');
    setUcenterRoleName('');
    setUcenterRoleUrl('');
  };

  // list
  const list = async (page, pageSize, ucenterRoleName, ucenterRoleUrl) => {
    // options
    const options = {
      page: page || current || 1,
      rows: pageSize || pagesize || 10,
    };
    if (ucenterRoleName) options.ucenterRoleName = ucenterRoleName;
    if (ucenterRoleUrl) options.ucenterRoleUrl = ucenterRoleUrl;

    // list
    setLoading(true);
    const listDataRes = await postWithToken(`${host()}/ucenter/role/list`, options);
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
    const delDataRes = await postWithToken(`${host()}/ucenter/role/del`, {
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
    const getDataRes = await postWithToken(`${host()}/ucenter/role/get`, {
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
    setUcenterRoleName(item.ucenter_role_name);
    setUcenterRoleUrl(item.ucenter_role_url);
  };

  // on save
  const onSave = async () => {
    // check
    if (!ucenterRoleName) {
      message.error('缺少必填项！');
      return;
    }
    if (!ucenterRoleUrl) {
      message.error('缺少必填项！');
      return;
    }

    // save
    const options = {
      ucenterRoleName,
      ucenterRoleUrl,
    };
    if (id) options.id = id;
    const saveDataRes = await postWithToken(`${host()}/ucenter/role/save`, options);
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
    list(current, pagesize, ucenterRoleName, ucenterRoleUrl);
    setModalOpen(false);
  };

  // const
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },

    {
      title: 'ucenter_role_name',
      dataIndex: 'ucenter_role_name',
    },

    {
      title: 'ucenter_role_url',
      dataIndex: 'ucenter_role_url',
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
              placeholder="ucenterRoleName"
              value={ucenterRoleName}
              onChange={(e) => {
                setUcenterRoleName(e.target.value);
              }}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="ucenterRoleUrl"
              value={ucenterRoleUrl}
              onChange={(e) => {
                setUcenterRoleUrl(e.target.value);
              }}
            />
          </div>
        </Flex>
      </Modal>
    </div>
  );
};
