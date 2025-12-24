import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import EquivalencyPage from '../Equivalency';
import FormActivity from './Form';

const ModalActivity = (props: any) => {
	const intl = useIntl();
	const { record, edit } = useModel('cct.activity');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'activity.step.info' })} />
				<Steps.Step title={intl.formatMessage({ id: 'activity.step.cca' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <FormActivity afterAddNew={() => setCurrentStep(1)} /> : <EquivalencyPage />}
		</Card>
	);
};

export default ModalActivity;
