import useInitModel from '@/hooks/useInitModel';
import { type TinTuc } from '@/services/TinTuc/typing';

export default () => {
  const objInit = useInitModel<TinTuc.IRecord>('tin-tuc');

  return {
    ...objInit,
  };
};
