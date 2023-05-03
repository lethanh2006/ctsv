import useInitModel from '@/hooks/useInitModel';
import { type CongNhanKQHT } from '@/services/KetQuaHocTap/CongNhan/typing';

export default () => {
  const objInit = useInitModel<CongNhanKQHT.IRecord>('cong-nhan-kqht');

  return {
    ...objInit,
  };
};
