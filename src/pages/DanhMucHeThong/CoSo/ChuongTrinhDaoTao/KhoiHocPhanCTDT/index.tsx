import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Collapse,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tooltip,
} from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalKhoiHocPhanCTDT from './ModalKhoiHocPhanCTDT';
import './style.less';
import { ELoaiHocPhanCTDT } from '@/services/DanhMucHeThong/constant';
import PreviewDanhSachHocPhan from './PreviewDanhSachHocPhan';
import PreviewKhungCTDT from './PreviewKhungCTDT';
import TableStaticData from '@/components/Table/TableStaticData';

const KhoiHocPhanCTDTList = () => {
  const {
    getAllModel,
    deleteModel,
    setVisibleForm,
    setRecord,
    edit,
    visibleForm,
    setEdit,
    record,
    danhSach,
  } = useModel('chuongtrinhdaotao.khoihocphanctdt');
  const { record: recPhienBan } = useModel('chuongtrinhdaotao.phienbanctdt');
  const [groupKhoi, setGroupKhoi] = useState<Record<string, ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>>(
    {},
  );
  const [initKhoi, setInitKhoi] = useState<string>();
  const [initChuyenNganh, setInitChuyenNganh] = useState<string>();
  const [visibleDSHP, setVisibleDSHP] = useState(false);
  const [visibleKhung, setVisibleKhung] = useState(false);

  const getData = async () => {
    if (recPhienBan?._id)
      getAllModel(false, { soThuTuKy: 1 }, { phienBanId: recPhienBan._id }).then((data) => {
        const group = _.groupBy(data, (item) => item.khoiKienThucId);
        setGroupKhoi(group);
      });
    setRecord(undefined);
  };

  useEffect(() => {
    getData();
  }, [recPhienBan?._id]);

  const handleEdit = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
    setRecord(rec);
    setEdit(true);
    setVisibleForm(true);
  };

  const onCell = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => ({
    onClick: () => handleEdit(rec),
    style: { cursor: 'pointer' },
  });

  const onAddNew = (khoi?: string, nganh?: string) => {
    setInitKhoi(khoi);
    setInitChuyenNganh(nganh);
    setRecord(undefined);
    setEdit(false);
    setVisibleForm(true);
  };

  const columns: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
    { title: 'Tên học phần', width: 150, render: (val, rec) => rec.hocPhan?.ten, onCell },
    {
      title: 'Mã học phần',
      width: 80,
      render: (val, rec) => rec.hocPhan?.ma,
      align: 'center',
      onCell,
    },
    { title: 'Học kỳ dự kiến', width: 80, dataIndex: 'soThuTuKy', align: 'center', onCell },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa học phần">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getData)}
              title="Bạn có chắc chắn muốn xóa học phần này khỏi chương trình?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const columnsTuChon: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
    { title: 'Tên khối học phần', width: 150, dataIndex: 'ten', onCell },
    { title: 'Số tín chỉ', width: 80, dataIndex: 'soTinChiTuChonPhaiHoc', align: 'center', onCell },
    { title: 'Học kỳ dự kiến', width: 80, dataIndex: 'soThuTuKy', align: 'center', onCell },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa khối học phần tự chọn">
            <Popconfirm
              onConfirm={() => deleteModel(rec._id, getData)}
              title="Bạn có chắc chắn muốn xóa khối học phần này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const renderChuyenNganh = (dataChuyenNganh: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
    const dataTuChon = dataChuyenNganh.filter(
      (item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON,
    );
    const dataBatBuoc = dataChuyenNganh.filter(
      (item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC,
    );
    const dataTotNghiep = dataChuyenNganh.filter(
      (item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.THAY_THE_TOT_NGHIEP,
    );
    return (
      <>
        {dataBatBuoc?.length ? (
          <>
            <div className="fw500" style={{ marginBottom: 8 }}>
              Danh sách học phần bắt buộc
            </div>
            <TableStaticData data={dataBatBuoc} addStt columns={columns} size="small" />
          </>
        ) : null}
        {dataTotNghiep?.length ? (
          <>
            <div className="fw500" style={{ marginBottom: 8 }}>
              Danh sách học phần thay thế tốt nghiệp
            </div>
            <TableStaticData data={dataTotNghiep} addStt columns={columns} size="small" />
          </>
        ) : null}
        {dataTuChon?.length ? (
          <>
            <div className="fw500" style={{ marginBottom: 8 }}>
              Danh sách khối học phần tự chọn
            </div>
            <TableStaticData data={dataTuChon} addStt columns={columnsTuChon} size="small" />
          </>
        ) : null}
      </>
    );
  };

  const renderKhoi = (dataKhoi: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
    const khoiId = dataKhoi[0].khoiKienThucId;
    const dataKoChuyenNganh = dataKhoi.filter((item) => !item.chuyenNganhId);
    const groupChuyenNganh = _.groupBy(
      dataKhoi.filter((item) => !!item.chuyenNganhId),
      (item) => item.chuyenNganhId,
    );

    return (
      <>
        <div style={{ marginBottom: 12 }}>
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onAddNew(khoiId, undefined)}
          >
            Thêm học phần
          </Button>
        </div>

        {renderChuyenNganh(dataKoChuyenNganh)}

        <Collapse>
          {Object.entries(groupChuyenNganh).map(([nganh, hocPhan]) => (
            <Collapse.Panel
              header={
                <Space>
                  <span className="fw500">
                    Chuyên ngành: {hocPhan?.[0].chuyenNganh?.ten ?? '--'}
                  </span>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    type="link"
                    onClick={() => onAddNew(khoiId, nganh)}
                  >
                    Thêm học phần
                  </Button>
                </Space>
              }
              key={nganh ?? '1'}
            >
              {renderChuyenNganh(hocPhan)}
            </Collapse.Panel>
          ))}
        </Collapse>
      </>
    );
  };

  return (
    <Row gutter={[12, 12]}>
      {danhSach.length ? (
        <Col span={24}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setVisibleDSHP(true)}>Danh sách học phần</Menu.Item>
                <Menu.Item onClick={() => setVisibleKhung(true)}>
                  Khung chương trình đào tạo
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<EyeOutlined />} type="primary">
              Xem trước
            </Button>
          </Dropdown>
        </Col>
      ) : null}

      <Col span={24}>
        <Collapse>
          {groupKhoi
            ? Object.entries(groupKhoi).map(([khoi, data]) => (
                <Collapse.Panel
                  header={
                    <Space>
                      <b>KHỐI: {data?.[0].khoiKienThuc?.ten?.toLocaleUpperCase() ?? '--'}</b>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        type="link"
                        onClick={() => onAddNew(khoi, undefined)}
                      >
                        Thêm chuyên ngành
                      </Button>
                    </Space>
                  }
                  key={khoi}
                >
                  {renderKhoi(data)}
                </Collapse.Panel>
              ))
            : null}
        </Collapse>
      </Col>

      <Col span={24}>
        <Button block type="dashed" icon={<PlusCircleOutlined />} onClick={() => onAddNew()}>
          Thêm khối kiến thức
        </Button>
      </Col>

      <Modal
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        footer={null}
        title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ' khối học phần'}
        width={record?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ? 1000 : 800}
        maskClosable={false}
      >
        <ModalKhoiHocPhanCTDT
          initKhoi={initKhoi}
          initChuyenNganh={initChuyenNganh}
          getData={getData}
        />
      </Modal>

      <PreviewDanhSachHocPhan visble={visibleDSHP} setVisible={setVisibleDSHP} />

      <PreviewKhungCTDT visble={visibleKhung} setVisible={setVisibleKhung} />
    </Row>
  );
};

export default KhoiHocPhanCTDTList;
