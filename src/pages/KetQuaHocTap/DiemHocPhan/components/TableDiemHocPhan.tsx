import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHocPhan from '@/pages/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import { type DiemHocPhan } from '@/services/KetQuaHocTap/DiemHocPhan/typing';
import { ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDiemHocPhan from './Form';
import ViewDiemHocPhan from './ViewDiemHocPhan';

const TableDiemHocPhan = (props: { sinhVienSsoId: string }) => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, setCondition } =
    useModel('ketquahoctap.diemhocphan');
  const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
  const [diemHocPhanId, setDiemHocPhanId] = useState<string>();
  const { sinhVienSsoId } = props;

  useEffect(() => {
    if (sinhVienSsoId) setCondition({ sinhVienSsoId: sinhVienSsoId });
  }, [sinhVienSsoId]);

  const handleEdit = (rec: DiemHocPhan.IRecord) => {
    setRecord(rec);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (rec: DiemHocPhan.IRecord) => ({
    onClick: () => {
      setDiemHocPhanId(rec._id);
      setVisibleChiTietDiem(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<DiemHocPhan.IRecord>[] = [
    {
      title: 'Mã học phần',
      width: 100,
      align: 'center',
      render: (val, rec) => rec.hocPhan?.ma,
      onCell,
    },
    {
      title: 'Tên học phần',
      width: 150,
      render: (val, rec) => rec.hocPhan?.ten,
      filterType: 'customselect',
      filterCustomSelect: <SelectHocPhan multiple />,
      onCell,
    },
    {
      title: 'Điểm tổng kết',
      dataIndex: 'diemTongKet',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm chữ',
      dataIndex: 'diemChu',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'select',
      filterData: Object.values(ELoaiDiemChu),
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm thang 4',
      dataIndex: 'diemThang4',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 90,
    //   fixed: 'right',
    //   render: (rec: DiemHocPhan.IRecord) => (
    //     <>
    //       <Tooltip title="Chỉnh sửa">
    //         <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
    //       </Tooltip>
    //       <Tooltip title="Xóa">
    //         <Popconfirm
    //           onConfirm={() => deleteModel(rec._id, getModel)}
    //           title="Bạn có chắc chắn muốn xóa thông tin điểm này?"
    //           placement="topLeft"
    //         >
    //           <Button danger type="link" icon={<DeleteOutlined />} />
    //         </Popconfirm>
    //       </Tooltip>
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      <TableBase
        hideCard
        columns={columns}
        dependencies={[page, limit]}
        modelName="ketquahoctap.diemhocphan"
        title="Điểm học phần"
        Form={FormDiemHocPhan}
        buttons={{ create: false }}
      />

      <ViewDiemHocPhan
        visible={visibleChiTietDiem}
        setVisible={setVisibleChiTietDiem}
        diemHocPhanId={diemHocPhanId}
        hasEdit
      />
    </>
  );
};

export default TableDiemHocPhan;
