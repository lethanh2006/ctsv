import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectNganh from '../../Bo/Nganh/components/SelectNganh';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import ModalFormNganh from './components/ModalForm';

const NganhCoSo = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('danhmuc.nganhdaotao');
  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();

  const handleEdit = (record: NganhDaoTao.IRecordCoSo) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (record: NganhDaoTao.IRecordCoSo) => ({
    onClick: () => {
      setEdit(true);
      setRecord(record);
      setVisibleForm(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<NganhDaoTao.IRecordCoSo>[] = [
    {
      title: 'Mã ngành',
      dataIndex: 'dmNganhId',
      width: 100,
      render: (val, rec) => rec?.dmNganh?.ma,
      onCell,
    },
    {
      title: 'Mã nội bộ',
      dataIndex: 'ma',
      width: 100,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Tên ngành',
      dataIndex: 'dmNganhId',
      width: 150,
      filterType: 'customselect',
      filterCustomSelect: <SelectNganh multiple />,
      render: (val, rec) => rec?.dmNganh?.ten,
      onCell,
    },
    {
      title: 'Căn cứ pháp lý',
      dataIndex: 'canCuId',
      width: 120,
      filterType: 'customselect',
      filterCustomSelect: <SelectVanBanQuyDinh multiple hasCreate={false} />,
      render: (val, rec) => (
        <>
          {val ? (
            <a
              onClick={() => {
                setVanBanId(rec?.canCu?._id);
                setVisibleCanCu(true);
              }}
            >
              <EyeOutlined /> {rec?.canCu?.ma}
            </a>
          ) : (
            'Chưa cập nhật'
          )}
        </>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: NganhDaoTao.IRecordCoSo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, () => getModel({ parentId: null }))}
              title="Bạn có chắc chắn muốn xóa ngành đào tạo này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        params={{ parentId: null }}
        dependencies={[page, limit]}
        modelName="danhmuc.nganhdaotao"
        title="Ngành đào tạo"
        Form={ModalFormNganh}
        widthDrawer={800}
      />

      {vanBanId ? (
        <ViewVanBanQuyDinh
          visible={visibleCanCu}
          setVisible={setVisibleCanCu}
          vanBanId={vanBanId}
        />
      ) : null}
    </>
  );
};

export default NganhCoSo;
