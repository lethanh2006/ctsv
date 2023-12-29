import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<TrinhDoDaoTao.IRecordNhaNuoc>('dm-trinh-do-nn');

  return {
    ...objInit,
  };
};
