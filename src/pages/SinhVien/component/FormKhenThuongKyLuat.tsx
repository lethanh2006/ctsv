import { Collapse } from 'antd';
import KhenThuongSinhVienPage from '../KhenThuongSinhVien';
import KyLuatSinhVienPage from '../KyLuatSinhVien';

const FormKhenThuongKyLuat = () => {
  return (
    <>
      <Collapse>
        <Collapse.Panel header="Thông tin khen thưởng" key={'1'}>
          <KhenThuongSinhVienPage />
        </Collapse.Panel>

        <Collapse.Panel header="Thông tin kỷ luật" key={'2'}>
          <KyLuatSinhVienPage />
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default FormKhenThuongKyLuat;
