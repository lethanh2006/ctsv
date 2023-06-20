import useInitModel from '@/hooks/useInitModel';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiBieuMau } from '@/services/TienIch/constant';
import { useForm } from 'antd/lib/form/Form';

export default () => {
  const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, {
    loai: ELoaiBieuMau.KHAO_SAT,
  });
  const [formCauHinhBieuMau] = useForm();

  return {
    ...objInit,
    formCauHinhBieuMau,
  };
};
