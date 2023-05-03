import { type ChuongTrinhDaoTao } from '@/services/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT } from '@/services/DanhMucHeThong/constant';
import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormKhoiHocPhanCTDT from './Form';
import HocPhanCTDT from '../HocPhanCTDT';

const ModalKhoiHocPhanCTDT = (props: {
  initKhoi?: string;
  initChuyenNganh?: string;
  getData: any;
}) => {
  const { initKhoi, initChuyenNganh, getData } = props;
  const { record, setVisibleForm } = useModel('chuongtrinhdaotao.khoihocphanctdt');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [record?._id]);

  const onChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  const onAfterInertOrUpdate = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
    if (rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON) onChangeStep(1);
    else setVisibleForm(false);
  };

  return (
    <>
      {record?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ? (
        <Steps
          current={currentStep}
          type="navigation"
          style={{ marginBottom: 18, paddingTop: 0 }}
          onChange={record?._id ? onChangeStep : undefined}
        >
          <Steps.Step title="Thông tin chung" />
          <Steps.Step title="Danh sách học phần tự chọn" disabled={!record?._id} />
        </Steps>
      ) : null}

      {currentStep === 0 ? (
        <FormKhoiHocPhanCTDT
          initKhoi={initKhoi}
          initNganh={initChuyenNganh}
          getData={getData}
          afterInsertOrUpdate={onAfterInertOrUpdate}
        />
      ) : (
        <HocPhanCTDT />
      )}
    </>
  );
};

export default ModalKhoiHocPhanCTDT;
