import useInitModel from '@/hooks/useInitModel';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<NguonThu.IRecord>('nguon-thu', undefined, undefined, ipTaiChinh);

  return {
    ...objInit,
  };
};
