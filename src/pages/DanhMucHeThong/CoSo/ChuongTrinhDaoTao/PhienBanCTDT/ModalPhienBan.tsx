import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormPhienBan from './FormPhienBan';
import KhoiHocPhanCTDTList from '../KhoiHocPhanCTDT';

const ModalPhienBan = (props: any) => {
  const { record, edit, setVisibleForm } = useModel('chuongtrinhdaotao.phienbanctdt');
  const title = props?.title ?? '';
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [record?._id]);

  const onChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()} ${record?.ma ?? ''}`}>
      <Steps
        current={currentStep}
        type="navigation"
        style={{ marginBottom: 18, paddingTop: 0 }}
        onChange={record?._id ? onChangeStep : undefined}
      >
        <Steps.Step title="Thông tin chung" />
        <Steps.Step title="Nội dung chi tiết" disabled={!record?._id} />
      </Steps>

      {currentStep === 0 ? (
        <FormPhienBan afterAddNew={() => setCurrentStep(1)} />
      ) : (
        <KhoiHocPhanCTDTList />
      )}

      {currentStep !== 0 ? (
        <div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
          <Button onClick={() => setVisibleForm(false)}>Hoàn thành</Button>
        </div>
      ) : null}
    </Card>
  );
};

export default ModalPhienBan;
