import useInitModel from '@/hooks/useInitModel';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<KhoanThu.IRecord>('khoan-thu', undefined, undefined, ipTaiChinh);

  return {
    ...objInit,
  };
};
