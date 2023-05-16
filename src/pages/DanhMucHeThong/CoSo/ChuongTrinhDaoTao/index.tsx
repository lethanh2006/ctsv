import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import SelectNganhCoSo from '../Nganh/components/SelectNganh';
import SelectTrinhDo from '../TrinhDo/components/Select';
import ModalChuongTrinh from './components/ModalChuongTrinh';

const ChuongTrinhDaoTaoPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel(
    'chuongtrinhdaotao.chuongtrinh',
  );
  // const [visible, setVisible] = useState<boolean>(false);

  const handleEdit = (record: ChuongTrinhDaoTao.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const onCell = (record: ChuongTrinhDaoTao.IRecord) => ({
    onClick: () => handleEdit(record),
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ChuongTrinhDaoTao.IRecord>[] = [
    {
      title: 'Trình độ đào tạo',
      width: 150,
      dataIndex: 'trinhDoDaoTaoId',
      filterType: 'customselect',
      filterCustomSelect: <SelectTrinhDo multiple />,
      render: (val, rec) => rec?.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--',
      onCell,
    },
    {
      title: 'Tên chương trình đào tạo',
      dataIndex: 'ten',
      width: 150,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Ngành đào tạo',
      width: 150,
      dataIndex: 'nganhId',
      filterType: 'customselect',
      filterCustomSelect: <SelectNganhCoSo multiple />,
      render: (val, rec) => `${rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
      onCell,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ChuongTrinhDaoTao.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa chương trình đào tạo này?"
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
        modelName="chuongtrinhdaotao.chuongtrinh"
        title="Chương trình đào tạo"
        Form={ModalChuongTrinh}
        widthDrawer={800}
      />
      {/* <ModalChiTietCTDT visible={visible} setVisible={setVisible} /> */}
    </>
  );
};

export default ChuongTrinhDaoTaoPage;
