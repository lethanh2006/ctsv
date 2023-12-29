import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<HocLieu.IRecord>('hoc-lieu');

  return {
    ...objInit,
  };
};
