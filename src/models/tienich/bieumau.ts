import useInitModel from '@/hooks/useInitModel';
import {
  getBieuMauThongKe,
  getIdBieuMauDaTraLoi,
  kichHoatBieuMau,
} from '@/services/TienIch/BieuMau';
import { EPhamViChuDe } from '@/services/TinTuc/constant';
import { message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<BieuMau.Record>('khao-sat');
  const { setFormSubmiting, getModel } = objInit;
  const [loaiBieuMau, setLoaiBieuMau] = useState<string | undefined>(undefined);
  const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);
  const [thongKe, setThongKe] = useState<BieuMau.ThongKe>();
  const [phamVi, setPhamVi] = useState<EPhamViChuDe>(EPhamViChuDe.TAT_CA);
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
    const response = await getIdBieuMauDaTraLoi(loaiBieuMau);
    setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
    setFormSubmiting(false);
  };

  return {
    ...objInit,
    phamVi,
    setPhamVi,
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    setListIdBieuMauDaTraLoi,
    getBieuMauThongKeModel,
    thongKe,
    setThongKe,
    kichHoatBieuMauModel,
    setLoaiBieuMau,
    loaiBieuMau,
    formCauHinhBieuMau,
  };
};
