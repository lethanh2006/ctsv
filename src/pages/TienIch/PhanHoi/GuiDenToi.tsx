/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useAccess, useModel } from 'umi';
import Form from './components/Form';
import { type IColumn } from '@/components/Table/typing';

const PhanHoi = () => {
  const access = useAccess();
  const {
    setVisibleForm,
    setRecord,
    page,
    limit,
    setDaTraLoi,
    setVaiTro,
    daTraLoi,
    vaiTro,
    condition,
    setDanhSach,
    getPhanHoiFromOtherModel,
  } = useModel('phanhoi');

  const handleEdit = (record: PhanHoi.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
  };

  useEffect(() => {
    return () => {
      setDanhSach([]);
    };
  }, []);

  // const canAnswer = useCheckAccess('phan-hoi:answer');

  const columns: IColumn<PhanHoi.IRecord>[] = [
    {
      title: 'Mã định danh',
      dataIndex: 'maSv',
      align: 'center',
      filterType: 'string',
      width: 120,
    },
    // {
    //   title: 'Người gửi',
    //   dataIndex: 'hoTenNguoiPhanHoi',
    //   align: 'center',
    //       filterType: 'string',
    //   width: 130,
    // },
    // {
    //   title: 'Người trả lời',
    //   dataIndex: 'hoTenNguoiTraLoi',
    //   align: 'center',
    //   width: 150,
    //   hide: !daTraLoi,
    // },
    {
      title: 'Câu hỏi',
      dataIndex: 'noiDungPhanHoi',
      align: 'left',
      filterType: 'string',
      width: 200,
      render: (val) => (
        <Typography.Paragraph
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlPhanAnh',
      align: 'center',
      render: (val) =>
        val ? (
          <a href={val} target="_blank" rel="noreferrer">
            File đính kèm
          </a>
        ) : (
          ''
        ),
      width: 100,
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'noiDungTraLoiPhanHoi',
      align: 'left',
      filterType: 'string',
      hide: !daTraLoi,
      width: 200,
    },
    {
      title: 'Thời gian hỏi',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      width: 120,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      render: (record) => (
        <>
          <Tooltip title={daTraLoi ? 'Xem nội dung trả lời' : 'Trả lời'}>
            <Button
              // disabled={!canAnswer}
              onClick={() => handleEdit(record)}
              type="primary"
              shape="circle"
            >
              {daTraLoi ? <EyeOutlined /> : <EditOutlined />}
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const onChangeVaiTro = (value: string) => {
    setVaiTro(value);
  };

  const onChangeTrangThai = (value: string) => {
    const isAnswer = value === 'Đã trả lời';
    setDaTraLoi(isAnswer);
  };

  return (
    <TableBase
      scroll={{ x: 900 }}
      columns={columns}
      getData={getPhanHoiFromOtherModel}
      dependencies={[vaiTro, daTraLoi, page, limit, condition]}
      modelName="phanhoi"
      title="Quản lý phản hồi"
      Form={Form}
    >
      {/* {(access.adminVaQuanTri || access.nhanVien) && (
        <Select
          placeholder="Lọc theo vai trò người gửi"
          onChange={onChangeVaiTro}
          value={vaiTro}
          style={{ width: 220, marginBottom: 8, marginRight: 8 }}
        >
          {[
            { value: 'sinh_vien', name: 'Sinh viên' },
            { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
          ]?.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      )} */}
      <Select
        placeholder="Lọc theo trạng thái"
        onChange={onChangeTrangThai}
        value={daTraLoi ? 'Đã trả lời' : 'Chưa trả lời'}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {['Đã trả lời', 'Chưa trả lời']?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </TableBase>
  );
};

export default PhanHoi;
