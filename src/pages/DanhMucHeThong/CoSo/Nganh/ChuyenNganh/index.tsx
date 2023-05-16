import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn, type TFilter } from '@/components/Table/typing';
import SelectVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '@/pages/DanhMucHeThong/VanBanQuyDinh/components/ViewVanBan';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectNganhCoSo from '../components/SelectNganh';
import FormChuyenNganh from './FormChuyenNganh';

const ChuyenNganhLocal = (props: { hideCard?: boolean }) => {
  const { setEdit, setVisibleForm, setRecord, deleteModel, getModel } =
    useModel('danhmuc.chuyennganh');
  const { record: recNganh } = useModel('danhmuc.nganhdaotao');
  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const isChuyenNganh = arrPathName.includes('chuyen-nganh');
  const filter: TFilter<NganhDaoTao.IRecordCoSo> = {
    field: 'parentId',
    operator: isChuyenNganh ? EOperatorType.NOT_NULL : EOperatorType.EQUAL,
    values: recNganh?._id && !isChuyenNganh ? [recNganh._id] : [''],
    active: true,
  };

  const handleEdit = (recChuyenNganh: NganhDaoTao.IRecordCoSo) => {
    setRecord(recChuyenNganh);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<NganhDaoTao.IRecordCoSo>[] = [
    {
      title: 'Mã chuyên ngành',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên chuyên ngành',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Ngành đào tạo',
      dataIndex: 'parentId',
      width: 150,
      filterType: 'customselect',
      filterCustomSelect: <SelectNganhCoSo multiple />,
      render: (val, rec) => rec.parent?.ten,
      hide: !isChuyenNganh,
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
      render: (rec) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, () => getModel(undefined, [filter]))}
              title="Bạn có chắc chắn muốn xóa chuyên ngành này?"
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
        modelName="danhmuc.chuyennganh"
        columns={columns}
        getData={() => getModel(undefined, [filter])}
        Form={FormChuyenNganh}
        hideCard={props?.hideCard}
        title="Chuyên ngành"
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

export default ChuyenNganhLocal;
