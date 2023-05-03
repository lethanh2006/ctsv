import { Card, Steps } from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import FormNhomTietHoc from './Form';
import TietHoc from '../../TietHoc';

const ModalFormNhomTietHoc = (props: any) => {
  const { record, edit } = useModel('danhmuc.nhomtiethoc');
  const title = props?.title ?? '';
  const [currentStep, setCurrentStep] = useState<number>(0);

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
        <Steps.Step title="Danh sách tiết học" disabled={!record?._id} />
      </Steps>

      {currentStep === 0 ? (
        <FormNhomTietHoc afterAddNew={() => setCurrentStep(1)} />
      ) : (
        <TietHoc hideCard />
      )}
    </Card>
  );
};

export default ModalFormNhomTietHoc;
