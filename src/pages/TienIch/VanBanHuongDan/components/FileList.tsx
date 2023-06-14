import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormFile from './FormFile';

const FileList = () => {
  const {
    record,
    putModel,
    setRecordFile,
    setEditFile,
    getModel,
    setVisibleFormFile,
    visibleFormFile,
  } = useModel('tienich.vanbanhuongdan');

  const delFile = (id: string) => {
    const payload: any = {
      ...record,
      danhSachTep: record?.danhSachTep?.filter((item) => item._id !== id) ?? [],
    };

    putModel(record?._id ?? '', payload, getModel);
  };

  const handleEdit = (recordFile: VanBanHuongDan.IFile) => {
    setRecordFile(recordFile);
    setVisibleFormFile(true);
    setEditFile(true);
  };

  const handleAdd = () => {
    setRecordFile({} as VanBanHuongDan.IFile);
    setVisibleFormFile(true);
    setEditFile(false);
  };

  const columns: IColumn<VanBanHuongDan.IFile>[] = [
    {
      title: 'Tên văn bản',
      dataIndex: 'ten',
      width: 150,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Tệp đính kèm',
      dataIndex: 'url',
      width: 120,
      render: (val, recordFile) =>
        val ? (
          <>
            <PaperClipOutlined />{' '}
            <a href={val} target="_blank" rel="noreferrer">
              Xem tập tin
            </a>
          </>
        ) : null,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (recordFile: VanBanHuongDan.IFile) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(recordFile)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => delFile(recordFile._id)}
              title="Bạn có chắc chắn muốn xóa văn bản này?"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" style={{ marginBottom: 8, marginRight: 8 }} onClick={handleAdd}>
        <PlusCircleOutlined />
        Thêm mới
      </Button>

      <TableStaticData
        otherProps={{
          pagination: false,
        }}
        columns={columns}
        data={record?.danhSachTep ?? []}
        addStt
      />

      <Modal
        maskClosable={false}
        destroyOnClose
        footer={false}
        onCancel={() => setVisibleFormFile(false)}
        bodyStyle={{ padding: 0 }}
        visible={visibleFormFile}
      >
        <FormFile />
      </Modal>
    </>
  );
};

export default FileList;
