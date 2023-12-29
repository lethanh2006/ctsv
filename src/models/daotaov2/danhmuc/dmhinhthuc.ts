import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<HinhThucDaoTao.IRecordBo>('dm-hinh-thuc-dao-tao');

  return {
    ...objInit,
  };
};
