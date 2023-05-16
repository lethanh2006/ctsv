import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import SelectChuongTrinh from '../components/Select';
import FormHocKyCTDT from './Form';

const HocKyCTDT = (props: { hideCard?: boolean }) => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel(
    'chuongtrinhdaotao.hockyctdt',
  );

  const handleEdit = (record: ChuongTrinhDaoTao.IRecordHocKyCTDT) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<ChuongTrinhDaoTao.IRecordHocKyCTDT>[] = [
    {
      title: 'Chương trình',
      width: 200,
      dataIndex: 'chuongTrinhId',
      render: (val, rec) => <>{rec?.chuongTrinh?.ten}</>,
      filterType: 'customselect',
      filterCustomSelect: <SelectChuongTrinh multiple />,
    },

    {
      title: 'STT kỳ',
      dataIndex: 'soThuTuKy',
      align: 'center',
      width: 120,
      filterType: 'number',
      sortable: true,
    },
    {
      title: 'Số tín chỉ tự chọn phải học',
      dataIndex: 'soTinChiTuChonPhaiHoc',
      align: 'center',
      width: 150,
      filterType: 'number',
      sortable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ChuongTrinhDaoTao.IRecordHocKyCTDT) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa học kỳ CTĐT này?"
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
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="chuongtrinhdaotao.hockyctdt"
      title="Học kỳ CTĐT"
      Form={FormHocKyCTDT}
      hideCard={props?.hideCard}
    />
  );
};

export default HocKyCTDT;
