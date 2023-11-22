import KetQuaToanKhoaSinhVien from '@/pages/DaoTao/KetQuaHocTap/KetQuaToanKhoaSinhVien';
import { Button, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useModel } from 'umi';
import CongNoSinhVienPage from '../CongNoSinhVien';
import HocBongSinhVienPage from '../HocBongSinhVien';
import NoiNgoaiTruSinhVienPage from '../NoiNgoaiTruSinhVien';
import ViecLamSinhVienPage from '../ViecLamSinhVien';
import FormSinhVien from './Form';
import FormKhenThuongKyLuat from './FormKhenThuongKyLuat';
import FormQuaTrinhHocTap from './FormQuaTrinhHocTap';
import FormTotNghiepVanBang from './FormTotNghiepVanBang';
import LichSuSucKhoeSinhVienPage from '@/pages/HoSoTheoDoiSucKhoe/LichSuSucKhoe';

const ModalSinhVien = (props: any) => {
	const { record, edit, setVisibleForm, handleView } = useModel('sinhvien.sinhvien');
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
				<Tabs.TabPane tab='Thông tin cá nhân' key={'0'}>
					<FormSinhVien afterAddNew={() => setCurrentStep('1')} disabledForm={disabledForm} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Thông tin đào tạo' key={'1'} disabled={!record?.ssoId}>
					<FormQuaTrinhHocTap />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Kết quả học tập' key={'kqht'} disabled={!record?.ssoId}>
					<KetQuaToanKhoaSinhVien sinhVienSsoId={record?.ssoId} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Học bổng' key={'hb'} disabled={!record?.ssoId}>
					<HocBongSinhVienPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Khen thưởng - Kỷ luật' key={'2'} disabled={!record?.ssoId}>
					<FormKhenThuongKyLuat />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Công nợ' key={'7'} disabled={!record?.ssoId}>
					<CongNoSinhVienPage sinhVienSsoId={record?.ssoId} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Nội / ngoại trú' key={'4'} disabled={!record?.ssoId}>
					<NoiNgoaiTruSinhVienPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Tình trạng sức khỏe' key={'8'} disabled={!record?.ssoId}>
					<LichSuSucKhoeSinhVienPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Tốt nghiệp & Văn bằng' key={'5'} disabled={!record?.ssoId}>
					<FormTotNghiepVanBang />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Việc làm' key={'6'} disabled={!record?.ssoId}>
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
