import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import ModalDeCuongHocPhan from './components/ModalDeCuongHocPhan';

const DeCuongHocPhanPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel, putModel } =
    useModel('hocphan.decuonghocphan');
  const { record: recHocPhan } = useModel('hocphan.hocphan');
  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();

  const getData = () => getModel({ hocPhanId: recHocPhan?._id });

  const handleEdit = (rec: HocPhan.IDeCuongHocPhan) => {
    setRecord(rec);
    setEdit(true);
    setVisibleForm(true);
  };

  const onCell = (record: HocPhan.IDeCuongHocPhan) => ({
    onClick: () => {
      setRecord(record);
      setEdit(true);
      setVisibleForm(true);
    },
    style: { cursor: 'pointer' },
  });

  const onChecked = (checked: boolean, rec: HocPhan.IDeCuongHocPhan) => {
    putModel(rec?._id, { ...rec, active: checked }, getData);
  };

  const columns: IColumn<HocPhan.IDeCuongHocPhan>[] = [
    {
      title: 'Phiên bản',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Người biên soạn',
      dataIndex: 'nguoiBienSoan',
      width: 120,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Ngày áp dụng',
      dataIndex: 'ngayApDung',
      width: 120,
      align: 'center',
      sortable: true,
      render: (val) => val && moment(val).format('DD/MM/YYYY'),
      onCell,
    },
    {
      title: 'Căn cứ pháp lý',
      dataIndex: 'canCuId',
      width: 120,
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
      title: 'Trạng thái',
      dataIndex: 'active',
      width: 80,
      align: 'center',
      render: (val, rec) => (
        <Switch checked={val} onChange={(checked) => onChecked(checked, rec)} />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: HocPhan.IDeCuongHocPhan) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getData)}
              title="Bạn có chắc chắn muốn xóa đề cương này?"
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
        params={{ hocPhanId: recHocPhan?._id }}
        dependencies={[page, limit]}
        modelName="hocphan.decuonghocphan"
        title="Đề cương chi tiết học phần"
        Form={ModalDeCuongHocPhan}
        widthDrawer={800}
        hideCard
        buttons={{ filter: false, reload: false }}
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

export default DeCuongHocPhanPage;
