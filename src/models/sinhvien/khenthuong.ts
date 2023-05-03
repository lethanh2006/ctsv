import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/SinhVien/typings';
import { ip3 } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<SinhVien.IKhenThuongSinhVien>(
    'khen-thuong',
    undefined,
    undefined,
    ip3,
  );

  return {
    ...objInit,
  };
};
