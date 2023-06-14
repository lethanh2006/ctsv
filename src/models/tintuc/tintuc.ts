import useInitModel from '@/hooks/useInitModel';
import { addTinTuc, delTinTuc, getTinTuc, putTinTuc } from '@/services/TinTuc/tintuc';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<TinTuc.IRecord>('tin-tuc');
  const {
    setLoading,
    page,
    limit,
    condition,
    setDanhSach,
    setTotal,
    setVisibleForm,
    sort,
    filters,
  } = objInit;
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');

  const getTinTucModel = async (idHinhThuc?: number) => {
    setLoading(true);
    const response = await getTinTuc({
      page,
      limit,
      condition: {
        ...condition,
        hinhThucDaoTaoId: undefined,
        phamVi: phamVi,
      },
      sort,
      filters: filters?.filter((item) => item.active)?.map(({ active, ...item }) => item),
      idHinhThuc:
        idHinhThuc ||
        (condition?.hinhThucDaoTaoId !== -1 ? condition?.hinhThucDaoTaoId : undefined),
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const addTinTucModel = async (payload: TinTuc.IRecord) => {
    setLoading(true);
    try {
      await addTinTuc(payload);
      message.success('Thêm thành công');
      setLoading(false);
      getTinTucModel();
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const putTinTucModel = async (payload: { id: string; data: TinTuc.IRecord }) => {
    setLoading(true);
    try {
      await putTinTuc(payload);
      message.success('Sửa thành công');
      setLoading(false);
      getTinTucModel();
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const delTinTucModel = async (payload: { id: string }) => {
    setLoading(true);
    try {
      await delTinTuc(payload);
      message.success('Xóa thành công');
      getTinTucModel();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    phamVi,
    setPhamVi,
    addTinTucModel,
    putTinTucModel,
    delTinTucModel,
    getTinTucModel,
  };
};
