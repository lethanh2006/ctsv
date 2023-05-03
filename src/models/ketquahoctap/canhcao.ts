import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<CanhCaoHocTap.IRecord>('canh-cao-hoc-tap');

  return {
    ...objInit,
  };
};
