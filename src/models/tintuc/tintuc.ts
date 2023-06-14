import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<TinTuc.IRecord>('tin-tuc');
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');

  return {
    ...objInit,
    phamVi,
    setPhamVi,
  };
};
