import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<NhomTietHoc.IRecordCoSo>('nhom-tiet-hoc');

  return {
    ...objInit,
  };
};
