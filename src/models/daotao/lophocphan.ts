import useInitModel from '@/hooks/useInitModel';
import { type LopHocPhan } from '@/services/DaoTao/LopHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);

  return {
    ...objInit,
  };
};
