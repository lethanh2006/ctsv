import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus, mapColorApprovalStatus, mapNameApprovalStatus } from '@/services/CCT/constant';
import { ClockCircleOutlined, EnvironmentOutlined, HourglassOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Flex, Image, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

const CardSuKienCCT = (props: {
	record: Activity.IRecord;
	equivalencyAttributeIds: string[];
	onClick?: () => void;
	button?: JSX.Element;
	isPersonal?: boolean;
}) => {
	const { danhSach: dsAttribute } = useModel('danhmuc.attributes');
	const { record, equivalencyAttributeIds, onClick, button, isPersonal } = props;

	return (
		<Card
			hoverable={!!onClick}
			className='activity-card'
			cover={
				<div className='activity-cover'>
					<Image src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
				</div>
			}
			onClick={onClick}
			styles={{ body: { padding: 0 } }}
		>
			<div className='activity-content-wrapper'>
				<div className='activity-header'>
					<Title level={5} className='activity-title activity-line'>
						{record?.name}
					</Title>

					<Flex justify='space-between' align='center' gap='small' wrap>
						<div className='card-level'>
							{dsAttribute?.map((lv, idx) => {
								const isActive = equivalencyAttributeIds?.includes(lv?._id);
								return (
									<span key={idx} className={`level-item ${isActive ? 'active' : ''}`}>
										{lv?.code}
									</span>
								);
							})}
						</div>

						<Tag color={mapColorApprovalStatus[record?.workflow as EApprovalStatus]}>
							{mapNameApprovalStatus[record?.workflow as EApprovalStatus]}
						</Tag>
					</Flex>
				</div>

				<Space direction='vertical' className='activity-content'>
					<Space size='small'>
						<ClockCircleOutlined className='icon-light' />
						<span>
							<span className='text-semibold'>
								{record?.startDate && dayjs(record.startDate).format('HH:mm - DD/MM/YYYY')}
							</span>{' '}
							to{' '}
							<span className='text-semibold'>
								{record?.endDate && dayjs(record.endDate).format('HH:mm - DD/MM/YYYY')}
							</span>
						</span>
					</Space>

					{isPersonal ? (
						<Space size='small'>
							<UserOutlined className='icon-light' />
							<span>Approver: {record?.supervisorName}</span>
						</Space>
					) : (
						<>
							<Space size='small'>
								<EnvironmentOutlined className='icon-light' />
								<span>{record?.onCampus ? record?.facilityName : record?.otherAddress}</span>
							</Space>

							<Space size='small'>
								<HourglassOutlined className='icon-light' />
								<span className='text-danger'>
									Evidence update before{' '}
									{record?.allowPostEventResultsUpdate
										? record?.dueDate && dayjs(record.dueDate).format('HH:mm DD/MM/YYYY')
										: record?.endDate && dayjs(record.endDate).format('HH:mm DD/MM/YYYY')}
								</span>
							</Space>
						</>
					)}
				</Space>
			</div>

			{button && (
				<div className='activity-footer' onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
					{button}
				</div>
			)}
		</Card>
	);
};

export default CardSuKienCCT;
