import TableBase from '@/components/OldTable';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { PhanHoi } from '@/services/PhanHoi/typing';
import type { IColumn } from '@/utils/interfaces';
import { Button, Modal, Tabs, Tag, Tooltip } from 'antd';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import FormTraLoiPhanHoi from '../DichVuMotCuaV2/QuanLyDon/components/FormTraLoiPhanHoi';
import FormQuyTrinh from '../DichVuMotCuaV2/components/FormQuyTrinh';
import TableLichSuTraKetQua from '../DichVuMotCuaV2/components/TableLichSuTraKetQua';
import ThanhToan from '@/components/ThanhToan';
import { QuestionCircleOutlined } from '@ant-design/icons';

const PhanHoiComponent = () => {
  const { getModel, loading, setRecord, visibleForm, setVisibleForm, page, limit, condition } =
    useModel('phanhoi');

  const {
    getDonThaoTacChuyenVienDieuPhoiModel,
    setVisibleFormDon,
    setRecordDon,
    recordDon,
    visibleFormDon,
    setRecordDonThaoTac,
  } = useModel('dichvumotcuav2');

  const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');

  const handleDon = (recordDonColumn: DichVuMotCuaV2.Don) => {
    // if (pathname?.includes('quanlydondieuphoi'))
    getDonThaoTacChuyenVienDieuPhoiModel(undefined, { idDon: recordDonColumn?._id }, 1, 100);
    // else getDonThaoTacChuyenVienXuLyModel(undefined, { idDon: recordDonColumn?._id }, 1, 100);
    setRecordDon(recordDonColumn);
    setVisibleFormDon(true);
    setType('view');
  };

  const onCell = (recordPhanHoi: PhanHoi.IRecord) => ({
    onClick: () => {
      setRecord(recordPhanHoi);
      // getCsvcByIdModel(recordDonColumn?.idCoSoVatChat ?? '');
      handleDon(recordPhanHoi.idDonDVMC);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<PhanHoi.IRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      render: (val) => (
        <span title={moment(val).format('DD/MM/YYYY HH:mm:ss')}>{moment(val).fromNow()}</span>
      ),
      onCell,
    },
    {
      title: 'Loại đơn',
      dataIndex: ['idDonDVMC', 'thongTinDichVu', 'ten'],
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Trạng thái',
      width: 120,
      align: 'center',
      dataIndex: ['daTraLoiPhanHoi'],
      search: 'filterString',
      notRegex: true,
      key: 'daTraLoiPhanHoi',
      render: (val) => (
        <Tag color={!val ? '#dc3545' : '#28a745'}>{val ? 'Đã trả lời' : 'Chưa trả lời'}</Tag>
      ),
    },
    {
      title: 'Nội dung phản hồi',
      dataIndex: 'noiDungPhanHoi',
    },
    {
      title: 'Nội dung trả lời phản hồi',
      dataIndex: 'noiDungTraLoiPhanHoi',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (recordPhanHoiColumn: PhanHoi.IRecord) => {
        return (
          <>
            <Tooltip title="Trả lời phản hồi">
              <Button
                disabled={recordPhanHoiColumn.daTraLoiPhanHoi}
                onClick={() => {
                  setRecord(recordPhanHoiColumn);
                  setRecordDon(recordPhanHoiColumn.idDonDVMC);
                  setVisibleForm(true);
                }}
                icon={<QuestionCircleOutlined />}
                shape="circle"
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const getData = () => {
    getModel(undefined, undefined, undefined, undefined, undefined, 'page');
  };

  return (
    <>
      <TableBase
        dependencies={[page, limit, condition]}
        title="Phản hồi"
        columns={columns}
        modelName={'phanhoi'}
        loading={loading}
        getData={getData}
      />
      <Modal
        destroyOnClose
        width="900px"
        footer={false}
        visible={visibleFormDon}
        onCancel={() => {
          setVisibleFormDon(false);
        }}
      >
        <Tabs
          onChange={() => {
            setRecordDonThaoTac(undefined);
          }}
        >
          <Tabs.TabPane tab="Quy trình" key={0}>
            <FormQuyTrinh
              type="view"
              idDon={recordDon?._id}
              record={recordDon?.thongTinDichVu?.quyTrinh}
              thoiGianTaoDon={recordDon?.createdAt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Biểu mẫu" key={1}>
            <Form
              hideCamKet
              infoNguoiTaoDon={recordDon?.thongTinNguoiTao}
              type={type}
              onCancel={() => {
                setVisibleFormDon(false);
              }}
              record={recordDon}
            />
          </Tabs.TabPane>
          {recordDon?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan
                identityCode={recordDon?.identityCode}
                trangThaiThanhToan={recordDon?.trangThaiThanhToan}
              />
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab="Lịch sử trả kết quả" key={3}>
            <TableLichSuTraKetQua data={recordDon?.lichSuChinhSua ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Modal
        footer={false}
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        bodyStyle={{ padding: 0 }}
        width={600}
      >
        <FormTraLoiPhanHoi getData={getData} />
      </Modal>
    </>
  );
};

export default PhanHoiComponent;
