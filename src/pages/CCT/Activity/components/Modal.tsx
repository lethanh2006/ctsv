import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ListStudentActivity from '../ListStudent';
import FormActivity from './Form';

const ModalActivity = (props: any) => {
	const { getData } = props;
	const { visibleForm } = useModel('cct.activity');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		if (!visibleForm) {
			setCurrentStep(0);
		}
	}, [visibleForm]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<>
			<Steps current={currentStep} style={{ marginBottom: 18, paddingTop: 0 }} onChange={onChangeStep}>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Danh sách đăng ký' />
				<Steps.Step title='Danh sách minh chứng' />
			</Steps>

			{currentStep === 0 ? (
				<FormActivity afterAddNew={() => setCurrentStep(1)} getData={getData} />
			) : currentStep === 1 ? (
				<ListStudentActivity />
			) : (
				<></>
			)}
		</>
	);
};

export default ModalActivity;
