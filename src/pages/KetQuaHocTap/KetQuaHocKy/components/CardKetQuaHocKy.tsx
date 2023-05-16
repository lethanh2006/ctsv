import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type KetQuaHocKy } from '@/services/KetQuaHocTap/KetQuaHocKy/typing';
import { ETrinhDoKqhtHocKy } from '@/services/KetQuaHocTap/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormKetQuaHocKy from './Form';
import ViewKetQuaHocKy from './ViewKetQuaHocKy';

const CardKetQuaHocKy = () => {
  const { record: recordSVLopHC } = useModel('namhoc.sinhvienlophanhchinh');
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, setCondition } =
    useModel('ketquahoctap.ketquahocky');
  const [visibleChiTietDiem, setVisibleChiTietDiem] = useState(false);
  const [ketQuaHocKyId, setKetQuaHocKyId] = useState<string>();

  useEffect(() => {
    if (recordSVLopHC?.sinhVienSsoId) setCondition({ sinhVienSsoId: recordSVLopHC?.sinhVienSsoId });
  }, [recordSVLopHC?.sinhVienSsoId]);

  const handleEdit = (rec: KetQuaHocKy.IRecord) => {
    setRecord(rec);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (rec: KetQuaHocKy.IRecord) => ({
    onClick: () => {
      setKetQuaHocKyId(rec._id);
      setVisibleChiTietDiem(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<KetQuaHocKy.IRecord>[] = [
    {
      title: 'Học kỳ',
      dataIndex: 'hocKyId',
      width: 120,
      render: (val, rec) => rec.hocKy?.ten,
      onCell,
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'CPA',
      dataIndex: 'cpa',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Số TC đạt',
      dataIndex: 'soTinChiDat',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Số TC tích lũy',
      dataIndex: 'tongSoTinChiTichLuy',
      width: 120,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Số TC nợ',
      dataIndex: 'tongSoTinChiNo',
      width: 80,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Số TC đã đăng ký',
      dataIndex: 'tongSoTinChiDaDk',
      width: 120,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'number',
      sortable: true,
      onCell,
    },
    {
      title: 'Trình độ',
      dataIndex: 'trinhDo',
      width: 120,
      align: 'center',
      render: (val, rec) => val ?? '--',
      filterType: 'select',
      filterData: Object.values(ETrinhDoKqhtHocKy),
      sortable: true,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (rec: KetQuaHocKy.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getModel)}
              title="Bạn có chắc chắn muốn xóa thông tin điểm này?"
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
      <Card
        title={`Danh sách kết quả học tập học kỳ${
          recordSVLopHC?.sinhVien?._id ? ' của sinh viên ' + recordSVLopHC?.sinhVien?.ten : ''
        }`}
      >
        {recordSVLopHC?._id ? (
          <TableBase
            hideCard
            columns={columns}
            dependencies={[page, limit]}
            modelName="ketquahoctap.ketquahocky"
            title="Kết quả học tập học kỳ"
            Form={FormKetQuaHocKy}
          />
        ) : (
          <Empty description="Vui lòng chọn sinh viên" />
        )}
      </Card>

      <ViewKetQuaHocKy
        visible={visibleChiTietDiem}
        setVisible={setVisibleChiTietDiem}
        ketQuaHocKyId={ketQuaHocKyId}
        hasEdit
      />
    </>
  );
};

export default CardKetQuaHocKy;
