import useInitModel from '@/hooks/useInitModel';
import {
  getBieuMauThongKe,
  getIdBieuMauDaTraLoi,
  kichHoatBieuMau,
} from '@/services/TienIch/BieuMau';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, { loai: 'Khảo sát' });
  const { setFormSubmiting, getModel, condition } = objInit;
  const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);
  const [thongKe, setThongKe] = useState<BieuMau.ThongKe>();
  const [formCauHinhBieuMau] = useForm();

  const kichHoatBieuMauModel = async (payload: { id: string; data: { kichHoat: boolean } }) => {
    setFormSubmiting(true);
    await kichHoatBieuMau(payload);
    message.success('Xử lý thành công');
    setFormSubmiting(false);
    getModel();
  };

  const getBieuMauThongKeModel = async (id: string) => {
    setFormSubmiting(true);
    const response = await getBieuMauThongKe({ id });
    setThongKe(response?.data?.data ?? {});
    setFormSubmiting(false);
  };

  const getIdBieuMauDaTraLoiModel = async () => {
    setFormSubmiting(true);
    const response = await getIdBieuMauDaTraLoi(condition?.loai);
    setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
    setFormSubmiting(false);
  };

  return {
    ...objInit,
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    setListIdBieuMauDaTraLoi,
    getBieuMauThongKeModel,
    thongKe,
    setThongKe,
    kichHoatBieuMauModel,
    formCauHinhBieuMau,
  };
};
