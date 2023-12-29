import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<VanBanQuyDinh.IRecord>('can-cu-phap-ly');

  return {
    ...objInit,
  };
};
