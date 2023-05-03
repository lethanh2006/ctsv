import useInitModel from '@/hooks/useInitModel';
import { type ThoiHoc } from '@/services/KetQuaHocTap/ThoiHoc/typing';

export default () => {
  const objInit = useInitModel<ThoiHoc.IRecord>('thoi-hoc');

  return {
    ...objInit,
  };
};
