import useInitModel from '@/hooks/useInitModel';
import {
  addChuDe,
  delChuDe,
  getAllChuDe,
  getAllLoaiChuDe,
  getChuDe,
  putChuDe,
} from '@/services/ChuDe/chude';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<ChuDe.Record>('common-topic');
  const {
    sort,
    filters,
    setTotal,
    page,
    limit,
    condition,
    setVisibleForm,
    setPage,
    total,
    setDanhSach,
    setLoading,
  } = objInit;
  const [danhSachLoaiChuDe, setDanhSachLoaiChuDe] = useState<string[]>([]);
  const [loaiChuDe, setLoaiChuDe] = useState<string>();
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>();

  const getAllLoaiChuDeModel = async () => {
    setLoading(true);
    const response = await getAllLoaiChuDe();
    setDanhSachLoaiChuDe(response?.data?.data ?? []);
    setLoading(false);
  };
  const getChuDeModel = async (idHinhThuc?: number) => {
    setLoading(true);
    const response = await getChuDe({
      page,
      limit,
      condition: {
        ...condition,
        type: loaiChuDe,
        hinhThucDaoTaoId: undefined,
        phamVi,
      },
      sort,
      filters: filters?.filter((item) => item.active)?.map(({ active, ...item }) => item),
      idHinhThuc:
        idHinhThuc ||
        (condition?.hinhThucDaoTaoId === -1 ? undefined : condition?.hinhThucDaoTaoId),
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllChuDeModel = async (cond?: any): Promise<ChuDe.Record[]> => {
    setLoading(true);
    const response = await getAllChuDe({
      condition: { ...condition, ...(cond ?? {}) },
      idHinhThuc: condition?.hinhThucDaoTaoId,
      sort,
      filters: filters?.filter((item) => item.active)?.map(({ active, ...item }) => item),
    });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const addChuDeModel = async (payload: ChuDe.Record) => {
    try {
      setLoading(true);
      await addChuDe(payload);
      message.success('Thêm thành công');
      getChuDeModel();
      setVisibleForm(false);
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };
  const putChuDeModel = async (payload: { id: string; data: ChuDe.Record }) => {
    setLoading(true);
    await putChuDe(payload);
    message.success('Sửa thành công');
    setLoading(false);
    getChuDeModel();
    setVisibleForm(false);
  };

  const delChuDeModel = async (payload: { id: string }) => {
    setLoading(true);
    try {
      await delChuDe(payload);
      message.success('Xóa thành công');
      const maxPage = Math.ceil((total - 1) / limit);
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage || 1;
        setPage(newPage);
      }
    } finally {
      getChuDeModel();
      setLoading(false);
    }
  };

  return {
    ...objInit,
    phamVi,
    setPhamVi,
    getAllChuDeModel,
    addChuDeModel,
    putChuDeModel,
    delChuDeModel,
    setLoaiChuDe,
    loaiChuDe,
    getAllLoaiChuDeModel,
    danhSachLoaiChuDe,
    getChuDeModel,
  };
};
