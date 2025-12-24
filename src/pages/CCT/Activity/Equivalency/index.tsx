import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { Activity } from '@/services/CCT/Activity/typing';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const EquivalencyPage = () => {
	const intl = useIntl();
	const { record: recActi } = useModel('cct.activity');
	const { getModel, danhSach, loading } = useModel('cct.equivalency');

	const getData = () => {
		if (recActi?._id) {
			getModel({
				activitiesId: recActi?._id,
			});
		}
	};

	useEffect(() => {
		getData();
	}, [recActi?._id]);

	const columns: IColumn<Activity.IEquivalency>[] = [
		{
			title: 'Role',
			width: 120,
		},
		{
			title: 'Description',
			width: 180,
		},
		{
			title: 'Level',
			width: 80,
		},
		{
			title: 'E',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox />,
		},
		{
			title: 'X',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox />,
		},
		{
			title: 'C',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox />,
		},
		{
			title: 'L',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox />,
		},
		{
			title: 'Auto Approval',
			width: 120,
			align: 'center',
			render: (val, rec) => <Checkbox />,
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={danhSach ?? ''}
			loading={loading}
			size='small'
			otherProps={{ pagination: false }}
			otherButtons={[
				<ButtonExtend size='small' type='primary' icon={<PlusCircleOutlined />}>
					Thêm mới
				</ButtonExtend>,
			]}
		/>
	);
};

export default EquivalencyPage;
