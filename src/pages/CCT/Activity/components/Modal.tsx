import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import EquivalencyPage from '../Equivalency';
import FormActivity from './Form';

const ModalActivity = (props: any) => {
	const intl = useIntl();
	const { getData } = props;
	const { record, edit, isView, visibleForm } = useModel('cct.activity');
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
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'activity.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'activity.form.chitet' })
						: intl.formatMessage({ id: 'activity.form.themmoi' })
			}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'activity.step.info' })} />
				<Steps.Step
					title={intl.formatMessage({ id: 'activity.step.cca' })}
					disabled={!record?._id || !record?.activitiesTypeId}
				/>
			</Steps>

			{currentStep === 0 ? (
				<FormActivity afterAddNew={() => setCurrentStep(1)} getData={getData} />
			) : (
				<EquivalencyPage />
			)}
		</Card>
	);
};

export default ModalActivity;
