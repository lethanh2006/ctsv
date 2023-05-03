import { Collapse } from 'antd';
import CongNoSinhVienPage from '../CongNoSinhVien';

const FormCongNoSinhVien = () => {
  return (
    <>
      <Collapse>
        <Collapse.Panel header="Các khoản chưa nộp" key={'1'}>
          <CongNoSinhVienPage daNop={false} />
        </Collapse.Panel>

        <Collapse.Panel header="Các khoản đã nộp" key={'2'}>
          <CongNoSinhVienPage daNop />
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default FormCongNoSinhVien;
