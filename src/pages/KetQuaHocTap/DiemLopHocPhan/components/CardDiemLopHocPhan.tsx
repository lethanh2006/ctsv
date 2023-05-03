import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiDiemChu } from '@/services/KetQuaHocTap/constant';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Popconfirm, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormDiemLopHocPhan from './Form';
import ViewDiemLopHocPhan from './ViewDiemLopHocPhan';

const CardDiemLopHocPhan = () => {
  const { record: recordLopHP } = useModel('hocky.lophocphan');
  const { setEdit, setVisibleForm, setRecord, page, limit } = useModel('hocky.sinhvienlophocphan');
  const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
  const [diemLopHocPhanId, setDiemLopHocPhanId] = useState<string>();

  const handleEdit = (rec: LopHocPhan.IRecordSinhVienLopHP) => {
    setRecord(rec);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
    onClick: () => {
      setDiemLopHocPhanId(rec._id);
      setVisibleChiTietDiem(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'sinhVienSsoId',
      align: 'center',
      width: 120,
      render: (val, rec) => rec.sinhVien?.ma,
      onCell,
    },
    {
      title: 'Họ tên',
      width: 150,
      render: (val, rec) => rec.sinhVien?.ten,
      onCell,
    },
    {
      title: 'Điểm TP 1',
      dataIndex: 'diemThanhPhan1',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSo1 === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm TP 2',
      dataIndex: 'diemThanhPhan2',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSo2 === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm TP 3',
      dataIndex: 'diemThanhPhan3',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSo3 === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm TP 4',
      dataIndex: 'diemThanhPhan4',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSo4 === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm TP 5',
      dataIndex: 'diemThanhPhan5',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSo5 === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm TP 6',
      dataIndex: 'diemThanhPhan6',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSo6 === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm KTHP',
      dataIndex: 'diemKthp',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.trongSoKthp === 0,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Điểm tổng kết',
      dataIndex: 'diemTongKet',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      // hide: recordLopHP?.trongSoHocPhan?.cachTinhDiem === ECachTinhDiem.DAT,
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
      // hide: recordLopHP?.trongSoHocPhan?.cachTinhDiem === ECachTinhDiem.DAT,
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
      // hide: recordLopHP?.trongSoHocPhan?.cachTinhDiem === ECachTinhDiem.DAT,
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Kết quả',
      dataIndex: 'isDat',
      width: 100,
      align: 'center',
      render: (val, rec) =>
        val === true ? (
          <Tag color="green">Đạt</Tag>
        ) : val === false ? (
          <Tag color="volcano">Không đạt</Tag>
        ) : (
          '--'
        ),
      // hide:
      //   !recordLopHP?.trongSoHocPhan ||
      //   recordLopHP.trongSoHocPhan.cachTinhDiem === ECachTinhDiem.TRUNG_BINH,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (rec: LopHocPhan.IRecordSinhVienLopHP) => (
        <>
          <Tooltip title="Duyệt điểm">
            <Popconfirm
              title="Xác nhận duyệt điểm lớp học phần cho sinh viên này?"
              placement="topLeft"
            >
              <Button type="primary" shape="circle" icon={<CheckOutlined />} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
        </>
      ),
    },
  ];

  const otherButtons = [
    <Button key={'acceptAll'} icon={<CheckOutlined />} type="primary">
      Duyệt tất cả
    </Button>,
  ];

  return (
    <>
      <Card title={`Danh sách điểm lớp học phần ${recordLopHP?._id ? recordLopHP.ten : ''}`}>
        {recordLopHP?._id ? (
          <TableBase
            hideCard
            buttons={{ create: false }}
            columns={columns}
            params={{ lopHocPhanId: recordLopHP._id }}
            dependencies={[page, limit, recordLopHP._id]}
            modelName="hocky.sinhvienlophocphan"
            title="Điểm lớp học phần"
            Form={FormDiemLopHocPhan}
            otherButtons={otherButtons}
            widthDrawer={600}
          />
        ) : (
          <Empty description="Vui lòng chọn lớp học phần" />
        )}
      </Card>

      {diemLopHocPhanId ? (
        <ViewDiemLopHocPhan
          visible={visibleChiTietDiem}
          setVisible={setVisibleChiTietDiem}
          sinhVienLopHocPhanId={diemLopHocPhanId}
          hasEdit
        />
      ) : null}
    </>
  );
};

export default CardDiemLopHocPhan;
