import { Activity } from '@/services/CCT/Activity/typing';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietActivity from '../ChiTiet';
import ListEvidenceActivity from '../ListStudent/ListEvidence';
import RegisteredActivity from '../ListStudent/Registered';

const ModalActivity = () => {
	const intl = useIntl();
	const { visibleForm, record, setVisibleForm } = useModel('cct.activity');
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
					label: 'Activity Information',
					children: (
						<>
							<ChiTietActivity record={record ?? ({} as Activity.IRecord)} />

							<div className='form-footer'>
								<Button onClick={() => setVisibleForm(false)}>
									{intl.formatMessage({ id: 'global.button.dong' })}
								</Button>
							</div>
						</>
					),
				},
				{
					key: '1',
					label: 'Registration List',
					children: <RegisteredActivity />,
				},
				{
					key: '2',
					label: 'Evidence Declaration List',
					children: <ListEvidenceActivity />,
				},
			]}
		/>
	);
};

export default ModalActivity;
