import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<CoSoDaoTao.IRecord>('co-so-dao-tao');

  return {
    ...objInit,
  };
};
