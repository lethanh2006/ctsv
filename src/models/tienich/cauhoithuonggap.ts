import useInitModel from '@/hooks/useInitModel';
import type { CauHoiThuongGap } from '@/services/CauHoiThuongGap/typing';
import { ip3 } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<CauHoiThuongGap.IRecord>(
    'cau-hoi-thuong-gap',
    'condition',
    undefined,
    ip3,
  );
  return {
    ...objInit,
  };
};
