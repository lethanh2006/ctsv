import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<KhoaNganh.IRecord>('khoa-nganh');

  return {
    ...objInit,
  };
};
