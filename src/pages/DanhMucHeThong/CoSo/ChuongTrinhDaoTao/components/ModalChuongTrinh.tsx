import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PhienBanCTDTPage from '../PhienBanCTDT';
import FormChuongTrinhDaoTao from './Form';

const ModalChuongTrinh = (props: any) => {
  const { record, edit } = useModel('chuongtrinhdaotao.chuongtrinh');
  const title = props?.title ?? '';
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [record?._id]);

  const onChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Steps
        current={currentStep}
        type="navigation"
        style={{ marginBottom: 18, paddingTop: 0 }}
        onChange={record?._id ? onChangeStep : undefined}
      >
        <Steps.Step title="Thông tin chung" />
        <Steps.Step title="Nội dung chương trình" disabled={!record?._id} />
      </Steps>

      {currentStep === 0 ? (
        <FormChuongTrinhDaoTao afterAddNew={() => setCurrentStep(1)} />
      ) : (
        <PhienBanCTDTPage />
      )}
    </Card>
  );
};

export default ModalChuongTrinh;
