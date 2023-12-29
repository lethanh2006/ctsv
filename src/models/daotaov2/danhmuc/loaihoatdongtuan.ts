import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<LoaiHoatDongTuan.IRecord>('loai-hoat-dong-tuan');

  return {
    ...objInit,
  };
};
