import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import KhoaNganhDotKhaiBaoPage from '../../KhoaNganhDotKham';
import SinhVienDotKhaiBaoPage from '../../SinhVienDotKham';
import FormDotKhamSucKhoe from './Form';

const ModalDotKhamSucKhoe = (props: any) => {
	const { record, edit, setVisibleForm } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
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
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Chọn DS SV' disabled={!record?._id} />
				<Steps.Step title='Danh sách sinh viên' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormDotKhamSucKhoe afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<KhoaNganhDotKhaiBaoPage />
			) : (
				<SinhVienDotKhaiBaoPage />
			)}

			{currentStep !== 0 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button type='primary' onClick={() => setVisibleForm(false)}>
						Hoàn thành
					</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalDotKhamSucKhoe;
