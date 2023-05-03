import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectHinhThuc from '../../Bo/HinhThuc/components/SelectHinhThuc';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import Form from './components/Form';

const TrinhDoDTBo = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
    useModel('danhmuc.hinhthucdaotao');

  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();

  const handleEdit = (record: HinhThucDaoTao.IRecordCoSo) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<HinhThucDaoTao.IRecordCoSo>[] = [
    {
      title: 'Mã hình thức',
      dataIndex: 'danhMucHTDTId',
      width: 100,
      render: (val, rec) => rec?.danhMucHTDT?.ma,
    },
    {
      title: 'Tên hình thức',
      dataIndex: 'danhMucHTDTId',
      width: 150,
      render: (val, rec) => rec?.danhMucHTDT?.ten,
      filterType: 'customselect',
      filterCustomSelect: <SelectHinhThuc multiple />,
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
              style={{ padding: '0' }}
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
      render: (record: HinhThucDaoTao.IRecordCoSo) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa hình thức đào tạo này?"
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
        modelName="danhmuc.hinhthucdaotao"
        title="Hình thức đào tạo"
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

export default TrinhDoDTBo;
