import useInitModel from '@/hooks/useInitModel';
import { traLoiPhanHoiDvmc } from '@/services/PhanHoi';
import type { PhanHoi } from '@/services/PhanHoi/typing';
import { ip3 } from '@/utils/ip';
import { message } from 'antd';

export default () => {
  const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi', 'condition', undefined, ip3);

  const { setLoading, setVisibleForm } = objInit;

  const traLoiPhanHoiDvmcModel = async (
    idDonDVMC: string,
    payload: { noiDungTraLoiPhanHoi: string },
    getData?: any,
  ) => {
    setLoading(true);
    await traLoiPhanHoiDvmc(idDonDVMC, payload);
    message.success('Trả lời thành công');
    if (getData) getData();
    setLoading(false);
    setVisibleForm(false);
  };

  return {
    traLoiPhanHoiDvmcModel,
    ...objInit,
  };
};
