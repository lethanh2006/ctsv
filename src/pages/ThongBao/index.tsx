import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ThongBao } from '@/services/ThongBao/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import ViewThongBao from './components/ViewThongBao';
import moment from 'moment';
import { EReceiverType, LoaiDoiTuongThongBao } from '@/services/ThongBao/constant';

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
      width: 150,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: 200,
      filterType: 'string',
      onCell,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 200,
      filterType: 'string',
      onCell,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Đối tượng nhận thông báo',
      dataIndex: 'receiverType',
      width: 120,
      filterType: 'select',
      filterData: Object.values(EReceiverType).map((value) => ({
        value,
        label: LoaiDoiTuongThongBao?.[value] ?? '',
      })),
      onCell,
      render: (val: EReceiverType) => LoaiDoiTuongThongBao?.[val],
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'createdAt',
      width: 120,
      align: 'center',
      filterType: 'datetime',
      sortable: true,
      onCell,
      render: (val) => moment(val).format('HH:mm:ss DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (recordThongBao: ThongBao.IRecord) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button
              onClick={() => {
                setRecord(recordThongBao);
                setVisible(true);
              }}
              type="link"
              icon={<EyeOutlined />}
            />
          </Tooltip>
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
        widthDrawer={1000}
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
