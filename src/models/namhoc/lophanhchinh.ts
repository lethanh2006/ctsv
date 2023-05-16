import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh');

  return {
    ...objInit,
  };
};
