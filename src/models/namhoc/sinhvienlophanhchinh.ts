import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<LopHanhChinh.IRecordSinhVien>('lop-hc-sv');

  return {
    ...objInit,
  };
};
