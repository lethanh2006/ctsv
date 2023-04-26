
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKy,
  giangVienGetDiemTongKetSinhVienByIdSinhVien,
  sinhVienAllGetDiemTongKet,
  sinhVienGetDiemThanhPhanByHocKy,
  sinhVienGetDiemTongKetByHocKy,
} from '@/services/LopTinChi/ketquahoctap';
import {
  getAllLopTinChiSinhVien,
  getAllMonHocSinhVien,
  getBangDiem,
  getBieuMauById,
  getDanhSachSinhVienByIdNhomLop,
  getDotDanhGia,
  getInfoMonHoc,
  getLopTinChi,
  getLopTinChiById,
  getNhomLopTinChiById,
  getThongBaoLopTinChiById,
  getThongTinChungLopTinChiById,
  giangVienGetKetQuaHocTapByIdLopTinChi,
  giangVienGetLopTinChiByHocKy,
  giangVienNhapDiem,
  giangVienPutKetQuaHocTapByIdLopTinChi,
  sinhVienGetKetQuaHocTapByIdLopTinChi,
  sinhVienGetLopTinChiByHocKy,
  sinhVienThucHienBieuMau,
  verifyAccessDanhGia,
} from '@/services/LopTinChi/loptinchi';
import type { IResThongBaoLopTinChi, LopTinChi } from '@/services/LopTinChi/typings';
import { message } from 'antd';
import axios from 'axios';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<LopTinChi.Record[]>([]);
  const [danhSachNhomLop, setDanhSachNhomLop] = useState<LopTinChi.NhomLopTinChi[]>();
  const [danhSachDiemThanhPhanTheoKy, setDanhSachDiemThanhPhanTheoKy] = useState<
    LopTinChi.DiemThanhPhan[]
  >([]);
  const [idNhomLop, setIdNhomLop] = useState<number>(-1);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [infoMonHoc, setInfoMonHoc] = useState<LopTinChi.InfoMonHoc>();
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<LopTinChi.InfoMonHoc[]>([]);
  const [ketQuaHocTap, setKetQuaHocTap] = useState<LopTinChi.KetQuaHocTap>(
    {} as LopTinChi.KetQuaHocTap,
  );
  const [danhSachKetQuaHocTap, setDanhSachKetQuaHocTap] = useState<LopTinChi.KetQuaHocTap[]>([]);
  const [record, setRecord] = useState<LopTinChi.Record>({} as any);
  const [recordDiemTongKet, setRecordDiemTongKet] = useState<LopTinChi.DiemTongKet>();
  const [danhSachDiemTongKet, setDanhSachDiemTongKet] = useState<LopTinChi.DiemTongKet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>();
  const [dataDotDanhGia, setDataDotDanhGia] = useState<LopTinChi.DotDanhGia>();
  const [flagDaDanhGia, setFlagDaDanhGia] = useState(false);
  const [dataBieuMau, setDataBieuMau] = useState<BieuMau.Record>({} as BieuMau.Record);

  const [thongTinChung, setThongTinChung] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongTinNhomLop, setThongTinNhomLop] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongBao, setThongBao] = useState<IResThongBaoLopTinChi.Result[]>({} as any);


  const getBieuMauByIdModel = async (id: any) => {
    setLoading(true);
    const response = await getBieuMauById({ id });
    setDataBieuMau(response?.data?.data ?? {});
    setLoading(false);
  };

  const verifyAccessDanhGiaModel = async (idDot?: string, idLop?: number, idBieuMau?: string) => {
      setLoading(true);
      return verifyAccessDanhGia(idDot, idLop).then(() => {
        setFlagDaDanhGia(false);
        getBieuMauByIdModel(idBieuMau);
      }).catch(() => {
        setFlagDaDanhGia(true);
      }).finally(() => {
        setLoading(false);
      });
  };

  const getDotDanhGiaModel = async (kyHoc?: number) => {
    setLoading(true);
    const response = await getDotDanhGia(kyHoc);
    // if (response?.data?.data !== null) {
    //   await verifyAccessDanhGiaModel(response?.data?.data?._id, record?.id);
    //   if (!flagDaDanhGia) {
    //     getBieuMauByIdModel(response?.data?.data?.idBieuMau);
    //   }
    // }

    setDataDotDanhGia(response?.data?.data);
    setLoading(false);
  };

  const sinhVienThucHienBieuMauModel = async (payload: {
    idDotDanhGiaGiangVien?: string;
    idLopTinChi?: number;
    danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[];
  }) => {
    setLoading(true);
    message.success('Bạn đã thực hiện đánh giá');
    try {
      await sinhVienThucHienBieuMau(payload);
    } catch (error) {
      if(axios.isAxiosError(error))
      throw new Error(error?.response?.data?.errorCode);
    }
    
    
    setLoading(false);
  };

  const getLopTinChiByHocKyModel = async (payload: { idHocKy?: number }) => {
    const role = localStorage.getItem('vaiTro');
    if (!payload.idHocKy) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response =
      role === 'sinh_vien'
        ? await sinhVienGetLopTinChiByHocKy(payload.idHocKy)
        : await giangVienGetLopTinChiByHocKy(payload.idHocKy);
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length);
    setLoading(false);
  };

  const getThongTinChungLopTinChi = async (idLop: number) => {
    setLoading(true);
    const response = await getThongTinChungLopTinChiById(idLop);
    const data = response?.data?.data ?? {};
    setThongTinChung(data);
    setLoading(false);
    return data;
  };

  const getThongBaoLopTinChi = async (payload: any) => {
    setLoading(true);
    const response = await getThongBaoLopTinChiById(payload);
    setThongBao(response?.data?.data?.result);
    setLoading(false);
  };

  const sinhVienGetDiemThanhPhanByHocKyModel = async (idHocKy?: number) => {
    setLoading(true);
    const response = await sinhVienGetDiemThanhPhanByHocKy(idHocKy);
    setDanhSachDiemThanhPhanTheoKy(response?.data?.data ?? []);
    setLoading(false);
  };

  const sinhVienGetDiemTongKetByHocKyModel = async (idHocKy: number) => {
    setLoading(true);
    const response = await sinhVienGetDiemTongKetByHocKy(idHocKy);
    setRecordDiemTongKet(response?.data?.data);
    // setLoading(false);
  };

  const giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKyModel = async (
    idSinhVien: number,
    idHocKy?: number,
  ) => {
    setLoading(true);
    const response = await giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKy(
      idSinhVien,
      idHocKy,
    );
    setDanhSachDiemThanhPhanTheoKy(response?.data?.data ?? []);
    setLoading(false);
  };

  const giangVienGetDiemTongKetSinhVienByIdSinhVienModel = async (idSinhVien: number) => {
    setLoading(true);
    const response = await giangVienGetDiemTongKetSinhVienByIdSinhVien(idSinhVien);
    setDanhSachDiemTongKet(response?.data?.data ?? []);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const getLopTinChiByIdLop = async (idLop: number) => {
    setLoading(true);
    const response = await getLopTinChiById(idLop);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const getNhomLopTinChiByIdModel = async () => {
    if (!record.id) return;
    setLoading(true);
    const response = await getNhomLopTinChiById(record.id);
    setDanhSachNhomLop(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachSinhVienByIdNhomLopModel = async () => {
    if (idNhomLop === -1) return;
    setLoading(true);
    const response = await getDanhSachSinhVienByIdNhomLop(idNhomLop);
    setThongTinNhomLop(response?.data?.data);
    setLoading(false);
    return response?.data?.data;
  };

  const getInfoMonHocModel = async (idMonHoc: number) => {
    if (!idMonHoc) return;
    setLoading(true);
    const response = await getInfoMonHoc(idMonHoc);
    setInfoMonHoc(response?.data?.data);
    setLoading(false);
  };

  const sinhVienGetKetQuaHocTapByIdLopTinChiModel = async (idLop: number) => {
    setLoading(true);
    const response = await sinhVienGetKetQuaHocTapByIdLopTinChi(idLop);
    setKetQuaHocTap(response?.data?.data);
    setLoading(false);
  };

  const giangVienGetKetQuaHocTapByIdLopTinChiModel = async (idLop: number) => {
    setLoading(true);
    const response = await giangVienGetKetQuaHocTapByIdLopTinChi(idLop);
    setDanhSachKetQuaHocTap(response?.data?.data ?? []);
    setLoading(false);
  };

  const giangVienPutKetQuaHocTapByIdLopTinChiModel = async (
    idLop: number,
    data: { danhSachKetQua: LopTinChi.KetQuaHocTap[] },
  ) => {
    setLoading(true);
    await giangVienPutKetQuaHocTapByIdLopTinChi(idLop, data);
    message.success('Lưu thành công');
    giangVienGetKetQuaHocTapByIdLopTinChiModel(idLop);
    setLoading(false);
  };

  const adminGetLopTinChi = async (limitParam?: number) => {
    setLoading(true);
    const response = await getLopTinChi({ page, limit: limitParam || limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  const sinhVienGetDiemTongKetModel = async () => {
    setLoading(true);
    const response = await sinhVienAllGetDiemTongKet();
    setDanhSachDiemTongKet(response?.data?.data ?? []);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const getAllMonHocSinhVienModel = async (idHocKy?: number) => {
    const response = await getAllMonHocSinhVien({ condition: { idHocKy } });
    setDanhSachMonHoc(response?.data?.data ?? []);
  };

  const getAllLopTinChiSinhVienModel = async () => {
    const response = await getAllLopTinChiSinhVien();
    setDanhSach(response?.data?.data ?? []);
  };

  const getBangDiemModel = async (idLopTinChi: number) => {
    setLoading(true);
    const response = await getBangDiem(idLopTinChi);
    setDanhSachKetQuaHocTap(response?.data?.data ?? []);
    setLoading(false);
  };

  const giangVienNhapDiemModel = async (
    idLopTinChi: number,
    payload: { danhSachDiem: LopTinChi.KetQuaHocTap[] },
  ) => {
    try {
      setLoading(true);
      const response = await giangVienNhapDiem(idLopTinChi, payload);
      if (response?.data?.data?.success === true) {
        message.success('Lưu thành công');
        getBangDiemModel(idLopTinChi);
      } else {
        message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return {
    giangVienNhapDiemModel,
    getBangDiemModel,
    getAllLopTinChiSinhVienModel,
    getAllMonHocSinhVienModel,
    danhSachMonHoc,
    setDanhSachMonHoc,
    hinhThucDaoTao,
    setHinhThucDaoTao,
    sinhVienGetDiemTongKetModel,
    adminGetLopTinChi,
    setDanhSachDiemTongKet,
    danhSachDiemTongKet,
    giangVienGetDiemTongKetSinhVienByIdSinhVienModel,
    giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKyModel,
    sinhVienGetDiemTongKetByHocKyModel,
    recordDiemTongKet,
    setRecordDiemTongKet,
    danhSachDiemThanhPhanTheoKy,
    setDanhSachDiemThanhPhanTheoKy,
    sinhVienGetDiemThanhPhanByHocKyModel,
    setDanhSach,
    giangVienPutKetQuaHocTapByIdLopTinChiModel,
    setDanhSachKetQuaHocTap,
    giangVienGetKetQuaHocTapByIdLopTinChiModel,
    danhSachKetQuaHocTap,
    sinhVienGetKetQuaHocTapByIdLopTinChiModel,
    ketQuaHocTap,
    setKetQuaHocTap,
    condition,
    setCondition,
    filterInfo,
    setFilterInfo,
    infoMonHoc,
    setInfoMonHoc,
    getInfoMonHocModel,
    getDanhSachSinhVienByIdNhomLopModel,
    idNhomLop,
    setIdNhomLop,
    danhSachNhomLop,
    setDanhSachNhomLop,
    getNhomLopTinChiByIdModel,
    getThongTinChungLopTinChi,
    getThongBaoLopTinChi,
    getLopTinChiByIdLop,
    thongTinChung,
    setThongTinChung,
    thongBao,
    danhSach,
    page,
    limit,
    setLimit,
    setPage,
    record,
    setRecord,
    loading,
    setLoading,
    total,
    getLopTinChiByHocKyModel,
    getDotDanhGiaModel,
    dataDotDanhGia,
    sinhVienThucHienBieuMauModel,
    verifyAccessDanhGiaModel,
    flagDaDanhGia,
    dataBieuMau,
    thongTinNhomLop,
    getBieuMauByIdModel
  };
};
