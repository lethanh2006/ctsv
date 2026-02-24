import ModalExpandable from '@/components/Table/ModalExpandable';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus } from '@/services/CCT/constant';
import { CheckCircleOutlined, CloseCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietActivity from '../../Activity/ChiTiet';
import ModalChinhSuaImpact from '../Modal/ModalImpact';
import ModalChinhSuaTrangThai from '../Modal/ModalTrangThai';
import ModalXuLyActivityStudent from '../Modal/ModalXuLy';
import ChiTietActivityOutCome from './ChiTiet';

const FormActivityStudent = (props: any) => {
	const { getData, tabActive, isActivity } = props;
	const intl = useIntl();
	const { record, setVisibleForm, visibleForm } = useModel('cct.activityoutcome');

	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);
	const [visibleStatus, setVisibleStatus] = useState<boolean>(false);

	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();

	return (
		<ModalExpandable
			title='Detail Evidence'
			width={1000}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			open={visibleForm}
			styles={{
				body: { backgroundColor: '#F8F8F8', borderRadius: 2 },
				header: { backgroundColor: '#F8F8F8' },
			}}
		>
			{record?.activityCategory === EActivityCategory.REGISTERED ? (
				<ChiTietActivity
					record={{
						...record?.activities,
						workflow: record?.workflow,
						validation: record?.validation,
						rolesId: record?.rolesId,
						tracks: record?.tracks,
						levels: record?.levels,
						evidenceFile: record?.evidenceFile,
						competencyList: record?.competencyList,
						reflection: record?.reflection,
						revisionNote: record?.revisionNote,
					}}
					isRegistered
				/>
			) : (
				<ChiTietActivityOutCome recOutcome={record ?? ({} as ActivityOutCome.IRecord)} />
			)}

			<div
				style={{
					backgroundColor: '#fff',
					display: 'flex',
					gap: 8,
					justifyContent: 'flex-end',
					margin: '15px -15px -15px -15px',
					padding: 16,
				}}
			>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				{!isActivity && (
					<>
						<Button
							type='primary'
							disabled={record?.workflow === EApprovalStatus.APPROVED}
							className='btn-success'
							onClick={() => {
								setTrangThai({
									title: intl.formatMessage({ id: 'activityresult.xuly.duyet' }),
									trangThai: EApprovalStatus.APPROVED,
								});
								setVisibleXuLy(true);
							}}
							icon={<CheckCircleOutlined />}
						>
							{intl.formatMessage({ id: 'activityresult.button.duyet' })}
						</Button>

						{tabActive === '2' && (
							<>
								<Button
									type='primary'
									onClick={() => {
										setVisibleStatus(true);
									}}
									icon={<CheckCircleOutlined />}
								>
									Change status
								</Button>
								<Button
									type='primary'
									className='btn-success'
									onClick={() => {
										setVisibleImpact(true);
									}}
									icon={<CheckCircleOutlined />}
								>
									Verify impact
								</Button>
							</>
						)}

						{tabActive === '1' && (
							<>
								<Button
									type='primary'
									disabled={record?.workflow === EApprovalStatus.REJECTED}
									onClick={() => {
										setTrangThai({
											title: intl.formatMessage({ id: 'activityresult.xuly.tuchoi' }),
											trangThai: EApprovalStatus.REJECTED,
										});
										setVisibleXuLy(true);
									}}
									className='btn-error'
									icon={<CloseCircleOutlined />}
								>
									{intl.formatMessage({ id: 'activityresult.button.tuchoi' })}
								</Button>
								<Button
									type='primary'
									disabled={record?.workflow === EApprovalStatus.CHANGES_REQUIRED}
									onClick={() => {
										setTrangThai({
											title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
											trangThai: EApprovalStatus.CHANGES_REQUIRED,
										});
										setVisibleXuLy(true);
									}}
									className='btn-warning'
									icon={<RedoOutlined />}
								>
									{intl.formatMessage({ id: 'activityresult.button.yccs' })}
								</Button>
							</>
						)}
					</>
				)}
			</div>

			<ModalXuLyActivityStudent
				visible={visibleXuLy}
				setVisible={setVisibleXuLy}
				title={trangThai?.title ?? ''}
				trangThai={trangThai?.trangThai ?? EApprovalStatus.DRAFT}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>

			<ModalChinhSuaImpact
				visible={visibleImpact}
				setVisible={setVisibleImpact}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>

			<ModalChinhSuaTrangThai
				visible={visibleStatus}
				setVisible={setVisibleStatus}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>
		</ModalExpandable>
	);
};

export default FormActivityStudent;
