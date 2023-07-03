import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewThongBao from './components/ViewThongBao';

const ThongBaoPage = () => {
  const { page, limit, setRecord, record } = useModel('thongbao.thongbao');
  const [visible, setVisible] = useState<boolean>(false);

  const onCell = (recordThongBao: ThongBao.IRecord) => ({
    onClick: () => {
      setVisible(true);
      setRecord(recordThongBao);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ThongBao.IRecord>[] = [
    {
      title: 'Người gửi',
      dataIndex: 'senderName',
      align: 'center',
      width: 150,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      align: 'center',
      width: 200,
      filterType: 'string',
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      onCell,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    // {
    //   title: 'Nội dung',
    //   dataIndex: 'content',
    //   align: 'center',
    //   width: 200,
    //   onCell,
    //   render: (val) => (
    //     <Typography.Paragraph
    //       ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
    //     >
    //       {val}
    //     </Typography.Paragraph>
    //   ),
    // },
    {
      title: 'Thao tác',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (recordThongBao: ThongBao.IRecord) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => {
                setRecord(recordThongBao);
                setVisible(true);
              }}
              shape="circle"
              type="primary"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          {/* <Tooltip title="Sửa">
            <Button
              disabled={!canUpdate}
              onClick={() => {
                setRecord(recordThongBao);
                setEdit(true);
                setVisibleForm(true);
              }}
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              disabled={!canDelete}
              onConfirm={() => {
                deleteThongBaoModel(recordThongBao._id);
              }}
              title="Bạn có chắc chắn muốn xóa?"
            >
              <Button
                disabled={!canDelete}
                shape="circle"
                type="primary"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip> */}
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        title="Thông báo"
        columns={columns}
        modelName="thongbao.thongbao"
        widthDrawer={800}
        dependencies={[page, limit]}
        Form={Form}
      >
        {/* <FilterPhamVi modelName="thongbao.thongbao" /> */}
      </TableBase>

      <Modal
        width={800}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <ViewThongBao record={record} />
      </Modal>
    </>
  );
};

export default ThongBaoPage;
