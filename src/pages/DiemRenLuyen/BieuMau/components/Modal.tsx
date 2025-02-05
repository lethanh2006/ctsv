import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCauHinhBieuMau from './FormCauHinhBieuMau';
import FormThongTinChungKhaoSat from './FormThongTinChung';

const ModalKhaoSat = (props: any) => {
	const { record, edit, visibleForm } = useModel('khaosat.bieumau');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState<number>(0);

	const onChangeStep = (step: number) => setCurrentStep(step);

	useEffect(() => {
		if (!visibleForm) {
			setCurrentStep(0);
		}
	}, [visibleForm]);

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?.tieuDe ? onChangeStep : undefined}
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Cấu hình biểu mẫu' disabled={!record?.tieuDe} />
			</Steps>

			{currentStep === 0 ? (
				<FormThongTinChungKhaoSat afterAddNew={() => setCurrentStep(1)} />
			) : (
				<FormCauHinhBieuMau onBack={() => setCurrentStep(0)} getData={props?.getData} />
			)}
		</Card>
	);
};

export default ModalKhaoSat;
