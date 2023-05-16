import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/SinhVien/typings';

export default () => {
  const objInit = useInitModel<SinhVien.IHocBongSinhVien>('hoc-bong');

  return {
    ...objInit,
  };
};
