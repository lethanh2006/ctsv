import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<DotNhapHoc.IRecord>('dot-nhap-hoc');

  return {
    ...objInit,
  };
};
