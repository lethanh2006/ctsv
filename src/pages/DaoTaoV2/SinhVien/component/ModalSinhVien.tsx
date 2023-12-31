import KetQuaToanKhoaSinhVien from '@/pages/DaoTaoV2/KetQuaHocTap/KetQuaToanKhoa/KetQuaToanKhoaSinhVien';
import SinhVienHocVuPage from '@/pages/DaoTaoV2/SinhVien/XetHocVu';
import { Button, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';
import ChungChiSinhVienPage from '../ChungChiSinhVien';
import CongNoSinhVienPage from '../CongNoSinhVien';
import HocBongSinhVienPage from '../HocBongSinhVien';
import NoiNgoaiTruSinhVienPage from '../NoiNgoaiTruSinhVien';
import ViecLamSinhVienPage from '../ViecLamSinhVien';
import FormSinhVien from './Form';
import FormKhenThuongKyLuat from './FormKhenThuongKyLuat';
import FormQuaTrinhHocTap from './FormQuaTrinhHocTap';
import FormTotNghiepVanBang from './FormTotNghiepVanBang';

const ModalSinhVien = (props: any) => {
	const intl = useIntl();
	debugger;
	const { record, edit, setVisibleForm, handleView } = useModel('daotaov2.sinhvien.sinhvien');
	const [currentStep, setCurrentStep] = useState<string>('0');
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });
	const { disabledForm } = props;

	useEffect(() => {
		setCurrentStep('0');
	}, [record?.ssoId]);

	const onChangeStep = (step: string) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} hồ sơ sinh viên`}>
			<Tabs
				activeKey={currentStep}
				tabPosition={isTabletOrMobile ? 'top' : 'left'}
				onChange={record?.ssoId ? onChangeStep : undefined}
			>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab1' })} key={'0'}>
					<FormSinhVien afterAddNew={() => setCurrentStep('1')} disabledForm={disabledForm} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab2' })} key={'1'} disabled={!record?.ssoId}>
					<FormQuaTrinhHocTap />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab3' })} key={'kqht'} disabled={!record?.ssoId}>
					<KetQuaToanKhoaSinhVien sinhVienSsoId={record?.ssoId} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab4' })} key={'hb'} disabled={!record?.ssoId}>
					<HocBongSinhVienPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab5' })} key={'2'} disabled={!record?.ssoId}>
					<FormKhenThuongKyLuat />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab6' })} key={'7'} disabled={!record?.ssoId}>
					<CongNoSinhVienPage sinhVienSsoId={record?.ssoId} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab7' })} key={'4'} disabled={!record?.ssoId}>
					<NoiNgoaiTruSinhVienPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab11' })} key={'9'} disabled={!record?.ssoId}>
					<SinhVienHocVuPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab8' })} key={'8'} disabled={!record?.ssoId}>
					<ChungChiSinhVienPage fromSinhVien />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab9' })} key={'5'} disabled={!record?.ssoId}>
					<FormTotNghiepVanBang />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab10' })} key={'6'} disabled={!record?.ssoId}>
					<ViecLamSinhVienPage />
				</Tabs.TabPane>
			</Tabs>

			<div className='form-footer'>
				<Button onClick={() => handleView()}>Xem rút gọn</Button>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ModalSinhVien;
