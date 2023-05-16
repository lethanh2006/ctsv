import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<NamHoc.IRecord>('nam-hoc');

  return {
    ...objInit,
  };
};
