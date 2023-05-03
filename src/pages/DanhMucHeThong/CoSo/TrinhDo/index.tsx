import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectTrinhDo from '../../Bo/TrinhDo/components/SelectTrinhDo';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import Form from './components/Form';

const TrinhDoDTCoSo = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('danhmuc.trinhdo');

  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();

  const handleEdit = (rec: TrinhDoDaoTao.IRecordCoSo) => {
    setRecord(rec);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<TrinhDoDaoTao.IRecordCoSo>[] = [
    {
      title: 'Mã trình độ',
      dataIndex: 'dmTrinhDoId',
      width: 100,
      filterType: 'customselect',
      filterCustomSelect: <SelectTrinhDo multiple />,
      render: (val, rec) => rec?.dmTrinhDo?.ma,
    },
    {
      title: 'Mã nội bộ',
      dataIndex: 'ma',
      width: 100,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên trình độ',
      width: 150,
      render: (val, rec) => rec?.dmTrinhDo?.ten,
    },
    {
      title: 'Căn cứ pháp lý',
      dataIndex: 'canCuId',
      width: 150,
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
      render: (record: TrinhDoDaoTao.IRecordCoSo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa trình độ đào tạo này?"
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
        dependencies={[page, limit]}
        modelName="danhmuc.trinhdo"
        title="Trình độ đào tạo"
        Form={Form}
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

export default TrinhDoDTCoSo;
