import TableBase from '@/components/OldTable';
import type { CauHoiThuongGap } from '@/services/CauHoiThuongGap/typing';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormCauHoiThuongGap from './components/Form';

const CauHoiThuongGapComponent = () => {
  const {
    getModel,
    loading,
    condition,
    page,
    limit,
    setRecord,
    setVisibleForm,
    setEdit,
    deleteModel,
  } = useModel('cauhoithuonggap');

  const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'page');

  const columns: IColumn<CauHoiThuongGap.IRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'cauHoi',
    },
    {
      title: 'Trả lời',
      dataIndex: 'cauTraLoi',
      render: (val) => <div dangerouslySetInnerHTML={{ __html: val }} />,
    },
    {
      title: 'Thao tác',
      width: 120,
      render: (val: CauHoiThuongGap.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord(val);
                setEdit(true);
                setVisibleForm(true);
              }}
              icon={<EditOutlined />}
              shape="circle"
              type="primary"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => {
                deleteModel(val._id, getData);
              }}
              title="Bạn có chắc chắn xóa?"
            >
              <Button icon={<DeleteOutlined />} shape="circle" type="primary" danger />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      widthDrawer={700}
      Form={FormCauHoiThuongGap}
      hascreate
      loading={loading}
      getData={getData}
      modelName={'cauhoithuonggap'}
      columns={columns}
      dependencies={[condition, page, limit]}
      title="Câu hỏi thường gặp"
    />
  );
};

export default CauHoiThuongGapComponent;
