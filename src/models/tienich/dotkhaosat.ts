import useInitModel from '@/hooks/useInitModel';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { getDotKhaoSatThongKe, kichHoatDotKhaoSat } from '@/services/TienIch/DotKhaoSat';
import { type DotKhaoSat } from '@/services/TienIch/DotKhaoSat/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DotKhaoSat.IRecord>('dot-khao-sat');
  const { setFormSubmiting, getModel, setLoading } = objInit;
  const [thongKe, setThongKe] = useState<BieuMau.ThongKe>();

  const kichHoatBieuMauModel = async (payload: { id: string; data: { kichHoat: boolean } }) => {
    setFormSubmiting(true);
    await kichHoatDotKhaoSat(payload);
    message.success('Xử lý thành công');
    setFormSubmiting(false);
    getModel();
  };

  const getBieuMauThongKeModel = async (id: string) => {
    setLoading(true);
    try {
      const response = await getDotKhaoSatThongKe({ id });
      setThongKe(response?.data?.data ?? {});

      return response.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    thongKe,
    setThongKe,
    kichHoatBieuMauModel,
    getBieuMauThongKeModel,
  };
};
