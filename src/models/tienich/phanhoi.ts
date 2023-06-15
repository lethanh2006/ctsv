import useInitModel from '@/hooks/useInitModel';
import { getPhanHoiFromOther, traLoiPhanHoi } from '@/services/TienIch/PhanHoi/phanhoi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi');
  const { setLoading, setVisibleForm, getModel, setDanhSach, setTotal, page, limit } = objInit;
  const [vaiTro, setVaiTro] = useState<string>('sinh_vien');

  const traLoiPhanHoiModel = async (payload: {
    id: string;
    data: { noiDungTraLoiPhanHoi: string; maChuyenVien: string; noiDungPhanHoi: string };
  }) => {
    try {
      setLoading(true);
      await traLoiPhanHoi(payload);
      message.success('Trả lời thành công');
      setLoading(false);
      setVisibleForm(false);
      getModel();
    } catch (err) {
      setLoading(false);
    }
  };

  const getPhanHoiFromOtherModel = async () => {
    setLoading(true);
    const response = await getPhanHoiFromOther({
      page,
      limit,
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    ...objInit,
    traLoiPhanHoiModel,
    getPhanHoiFromOtherModel,
    vaiTro,
    setVaiTro,
  };
};
