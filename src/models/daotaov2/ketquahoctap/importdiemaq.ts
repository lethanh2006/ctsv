import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<any>('import-diem-aq');

  return {
    ...objInit,
  };
};
