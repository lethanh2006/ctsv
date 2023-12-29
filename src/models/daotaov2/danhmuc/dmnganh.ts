import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<NganhDaoTao.IRecordBo>('dm-nganh', undefined, undefined, undefined, {
    ma: 1,
  });

  return {
    ...objInit,
  };
};
