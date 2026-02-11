import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PersonalActivity from '../ListStudent/Personal';
import RegisteredActivity from '../ListStudent/Registered';
import FormActivity from './Form';

const ModalActivity = (props: any) => {
	const { getData } = props;
	const { visibleForm } = useModel('cct.activity');
	const [activeKey, setActiveKey] = useState<string>('0');

	useEffect(() => {
		if (!visibleForm) {
			setActiveKey('0');
		}
	}, [visibleForm]);

	return (
		<Tabs
			activeKey={activeKey}
			onChange={setActiveKey}
			items={[
				{
					key: '0',
					label: 'General Information',
					children: <FormActivity getData={getData} />,
				},
				{
					key: '1',
					label: 'Registration List',
					children: <RegisteredActivity />,
				},
				{
					key: '2',
					label: 'Evidence Declaration List',
					children: <PersonalActivity />,
				},
			]}
		/>
	);
};

export default ModalActivity;
