import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDon from './components/TableQuanLyDonChuyenVien';
const { TabPane } = Tabs;

const QuanLyDon = (props: { type?: string }) => {
  const {
    trangThaiQuanLyDon,
    trangThaiQuanLyDonThaoTac,
    setTrangThaiQuanLyDon,
    setTrangThaiQuanLyDonThaoTac,
    getAllBieuMauChuyenVienDieuPhoiModel,
    getAllBieuMauChuyenVienTiepNhanModel,
    setRecord,
    setDanhSach,
    setCondition,
    setFilterInfo,
    setLoaiDichVu,
    setPage,
    setTypeTraKetQua,
  } = useModel('dvmc.dichvumotcuav2');
  const { pathname } = window.location;
  // const { chuyenVienDieuPhoiGetTongSoDonDVMCModel, chuyenVienXuLyGetTongSoDonDVMCModel, idDichVu } =
  //   useModel('dashboard');

  useEffect(() => {
    setLoaiDichVu('DVMC');
    if (pathname?.includes('chuyenvientiepnhan')) {
      getAllBieuMauChuyenVienTiepNhanModel('DVMC');
    } else {
      if (pathname?.includes('quanlydondieuphoi')) {
        getAllBieuMauChuyenVienDieuPhoiModel('DVMC');
      } else {
        getAllBieuMauChuyenVienDieuPhoiModel('DVMC');
      }
    }

    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setCondition({});
      setFilterInfo({});
    };
  }, []);

  // useEffect(() => {
  //   if (pathname?.includes('quanlydondieuphoi')) {
  //     if (isDVMC)
  //       chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy, isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
  //     else getAllBieuMauVPSModel();
  //   } else {
  //     if (isDVMC)
  //       chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy, isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
  //     else getAllBieuMauVPSModel();
  //   }
  // }, [idDichVu]);

  return (
    <Card title="Quản lý đơn">
      <Tabs
        onChange={(key: string) => {
          setPage(1);
          if (key === 'DA_TRA_KQ' || key === 'CHUA_TRA_KQ') {
            setTypeTraKetQua(key);
          } else {
            setTypeTraKetQua('');
          }
          // if (pathname?.includes('quanlydondieuphoi')) {
          //   chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy);
          // } else {
          //   chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy);
          // }

          if (props.type==='Thao tác') {
            setTrangThaiQuanLyDonThaoTac(key)
          }else {
            setTrangThaiQuanLyDon(key);}
        }}
        activeKey={props?.type==='Thao tác'?trangThaiQuanLyDonThaoTac:trangThaiQuanLyDon}
      >
        <TabPane
          // tab={`Chờ xử lý (${
          //   recordTongSoDon?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0
          // })`}
          tab="Chờ xử lý"
          key={`${props?.type==='Thao tác'?'PENDING':'PROCESSING'}`}
        />
        <TabPane
          // tab={`Duyệt (${recordTongSoDon?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0})`}
          tab="Duyệt"
          key="OK"
        />
        <TabPane
          // tab={`Không duyệt (${
          //   recordTongSoDon?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0
          // })`}
          tab="Không duyệt"
          key="NOT_OK"
        />
        <TabPane tab="Chưa trả kết quả" key="CHUA_TRA_KQ" />
        <TabPane tab="Đã trả kết quả" key="DA_TRA_KQ" />
      </Tabs>

      <TableQuanLyDon type={props.type}/>
    </Card>
  );
};

export default QuanLyDon;
