import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<KhoiNganhDaoTao.IRecordBo>('dm-khoi-nganh');

  return {
    ...objInit,
  };
};
