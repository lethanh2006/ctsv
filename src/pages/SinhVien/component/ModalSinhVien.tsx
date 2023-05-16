import { Button, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormSinhVien from './Form';
import FormQuaTrinhHocTap from './FormQuaTrinhHocTap';
import FormKhenThuongKyLuat from './FormKhenThuongKyLuat';
import { useMediaQuery } from 'react-responsive';
import FormTotNghiepVanBang from './FormTotNghiepVanBang';
import ViecLamSinhVienPage from '../ViecLamSinhVien';
import FormCoVanHocTap from './FormCoVanHocTap';
import NoiNgoaiTruSinhVienPage from '../NoiNgoaiTruSinhVien';
import FormCongNoSinhVien from './FormCongNoSinhVien';

const ModalSinhVien = (props: any) => {
  const { record, edit, setVisibleForm } = useModel('sinhvien.sinhvien');
  const title = props?.title ?? '';
  const [currentStep, setCurrentStep] = useState<string>('0');
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });

  useEffect(() => {
    setCurrentStep('0');
  }, [record?.ssoId]);

  const onChangeStep = (step: string) => {
    setCurrentStep(step);
  };

  return (
    <Card
      title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}
      className="card-sinh-vien-has-scroll"
    >
      <div className="scroll-content">
        <Tabs
          activeKey={currentStep}
          tabPosition={isTabletOrMobile ? 'top' : 'left'}
          onChange={record?.ssoId ? onChangeStep : undefined}
        >
          <Tabs.TabPane tab="Thông tin cá nhân" key={'0'}>
            <FormSinhVien afterAddNew={() => setCurrentStep('1')} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Quá trình học tập" key={'1'} disabled={!record?.ssoId}>
            <FormQuaTrinhHocTap />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khen thưởng - Kỷ luật" key={'2'} disabled={!record?.ssoId}>
            <FormKhenThuongKyLuat />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Công nợ" key={'7'} disabled={!record?.ssoId}>
            <FormCongNoSinhVien />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cố vấn học tập" key={'3'} disabled={!record?.ssoId}>
            <FormCoVanHocTap />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Thông tin nội/ngoại trú" key={'4'} disabled={!record?.ssoId}>
            <NoiNgoaiTruSinhVienPage />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tốt nghiệp & Văn bằng" key={'5'} disabled={!record?.ssoId}>
            <FormTotNghiepVanBang />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Việc làm" key={'6'} disabled={!record?.ssoId}>
            <ViecLamSinhVienPage />
          </Tabs.TabPane>
        </Tabs>

        <div className="form-footer">
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </div>
    </Card>
  );
};

export default ModalSinhVien;
