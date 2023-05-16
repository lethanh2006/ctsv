import {
  getAllKyHoc,
  getAllKyHocByHinhThucDaoTaoGiangVien,
  getAllKyHocSinhVien,
  giangVienGetAllKyHocSinhVienByIdSinhVien,
  getAllKyHocByIdHinhThuc,
} from '@/services/kyhoc/kyhoc';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<KyHoc.Record[]>([]);
  const [record, setRecord] = useState<KyHoc.Record | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllKyHocByHinhThucDaoTaoGiangVienModel = async (idHinhThuc?: number) => {
    if (!idHinhThuc) return;
    const response = await getAllKyHocByHinhThucDaoTaoGiangVien(idHinhThuc);
    setDanhSach(response?.data?.data ?? []);
    if (!record?.id) setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getAllKyHocSinhVienModel = async (setRec: boolean = true) => {
    const response = await getAllKyHocSinhVien();
    setDanhSach(response?.data?.data ?? []);
    if (!record?.id && setRec) {
      setRecord(response?.data?.data?.[0]);
    }
    setLoading(false);
  };

  const giangVienGetAllKyHocSinhVienByIdSinhVienModel = async (
    idSinhVien: number,
    setRec: boolean = true,
  ) => {
    const response = await giangVienGetAllKyHocSinhVienByIdSinhVien(idSinhVien);
    setDanhSach(response?.data?.data ?? []);
    if (setRec) setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getAllKyHocModel = async (payload?: { idHinhThuc: number }) => {
    const response = await getAllKyHoc(payload);
    setDanhSach(response?.data?.data ?? []);
  };

  const getAllKyHocByIdHinhThucModel = async (idHinhThuc: any) => {
    const response = await getAllKyHocByIdHinhThuc(idHinhThuc);
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    getAllKyHocModel,
    setDanhSach,
    giangVienGetAllKyHocSinhVienByIdSinhVienModel,
    getAllKyHocSinhVienModel,
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getAllKyHocByHinhThucDaoTaoGiangVienModel,
    getAllKyHocByIdHinhThucModel,
  };
};
