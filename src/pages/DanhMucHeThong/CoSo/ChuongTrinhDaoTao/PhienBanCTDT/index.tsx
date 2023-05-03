import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/ViewVanBan';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalPhienBan from './ModalPhienBan';

const PhienBanCTDTPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, putModel } =
    useModel('chuongtrinhdaotao.phienbanctdt');
  const { record: recChuongTrinh } = useModel('chuongtrinhdaotao.chuongtrinh');
  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();

  const handleEdit = (rec: ChuongTrinhDaoTao.IPhienBanCTDT) => {
    setRecord(rec);
    setEdit(true);
    setVisibleForm(true);
  };

  const onCell = (record: ChuongTrinhDaoTao.IPhienBanCTDT) => ({
    onClick: () => {
      setRecord(record);
      setEdit(true);
      setVisibleForm(true);
    },
    style: { cursor: 'pointer' },
  });

  const onChecked = (checked: boolean, rec: ChuongTrinhDaoTao.IPhienBanCTDT) => {
    putModel(rec?._id, { ...rec, active: checked });
  };

  const columns: IColumn<ChuongTrinhDaoTao.IPhienBanCTDT>[] = [
    {
      title: 'Phiên bản',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      sortable: true,
      onCell,
    },
    {
      title: 'Ngày áp dụng',
      dataIndex: 'ngayBanHanh',
      width: 120,
      align: 'center',
      filterType: 'date',
      sortable: true,
      render: (val) => val && moment(val).format('DD/MM/YYYY'),
      onCell,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 80,
      align: 'center',
      render: (val, rec) => (
        <Switch checked={val} onChange={(checked) => onChecked(checked, rec)} />
      ),
    },
    {
      title: 'Căn cứ pháp lý',
      dataIndex: 'canCuId',
      width: 150,
      filterType: 'select',
      filterCustomSelect: <SelectVanBanQuyDinh hasCreate={false} multiple />,
      render: (val, rec) => (
        <>
          {val ? (
            <a
              onClick={() => {
                setVanBanId(rec?.canCuId);
                setVisibleCanCu(true);
              }}
            >
              <EyeOutlined /> {rec?.canCu?.ma ?? 'Xem chi tiết'}
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
      render: (record: ChuongTrinhDaoTao.IPhienBanCTDT) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() =>
                deleteModel(record._id, () => getModel({ hocPhanId: recChuongTrinh?._id }))
              }
              title="Bạn có chắc chắn muốn xóa phiên bản này?"
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
        params={{ chuongTrinhId: recChuongTrinh?._id }}
        dependencies={[page, limit]}
        modelName="chuongtrinhdaotao.phienbanctdt"
        title="Phiên bản CTĐT"
        Form={ModalPhienBan}
        widthDrawer={800}
        hideCard
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

export default PhienBanCTDTPage;
