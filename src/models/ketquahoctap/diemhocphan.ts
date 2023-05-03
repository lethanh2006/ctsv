import useInitModel from '@/hooks/useInitModel';
import { type DiemHocPhan } from '@/services/KetQuaHocTap/DiemHocPhan/typing';

export default () => {
  const objInit = useInitModel<DiemHocPhan.IRecord>('diem-hoc-phan');

  return {
    ...objInit,
  };
};
