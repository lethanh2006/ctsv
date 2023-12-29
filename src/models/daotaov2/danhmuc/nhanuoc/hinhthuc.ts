import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<HinhThucDaoTao.IRecordNhaNuoc>('dm-hinh-thuc-nn');

  return {
    ...objInit,
  };
};
