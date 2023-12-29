import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<KhoiKienThuc.IRecord>('khoi-kien-thuc');

  return {
    ...objInit,
  };
};
