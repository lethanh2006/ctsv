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
  const { setVisibleForm, setRecord, setDaTraLoi, daTraLoi, setCondition, page, limit } =
    useModel('phanhoi');
  // const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const handleEdit = (record: PhanHoi.IRecord) => {
    setRecord(record);
    setVisibleForm(true);
  };

  useEffect(() => {
    setCondition({ daTraLoiPhanHoi: false });
  }, []);

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
    //   search: 'search',
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

  const onChangeTrangThai = (value: string) => {
    const isAnswer = value === 'Đã trả lời';
    setCondition({ daTraLoiPhanHoi: isAnswer });
    setDaTraLoi(isAnswer);
  };

  console.log(daTraLoi, 'da tra loi');

  return (
    <TableBase
      scroll={{ x: 900 }}
      columns={columns}
      modelName="phanhoi"
      dependencies={[daTraLoi, page, limit]}
      title="Quản lý phản hồi"
      Form={Form}
      buttons={{ create: false }}
    >
      {/* {(access.admin || access.nhanVien) && (
        <Select
          value={condition?.hinhThucDaoTaoId ?? -1}
          onChange={(val: number) => {
            setCondition({ ...condition, hinhThucDaoTaoId: val });
          }}
          style={{ marginBottom: 8, width: 250, marginRight: 8 }}
        >
          <Select.Option value={-1} key={-1}>
            Tất cả hình thức đào tạo
          </Select.Option>
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_hinh_thuc_dao_tao}
            </Select.Option>
          ))}
        </Select>
      )}
      {(access.adminVaQuanTri || access.nhanVien) && (
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
