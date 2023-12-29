import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<LoaiHocBong.IRecord>('loai-hoc-bong');

  return {
    ...objInit,
  };
};
