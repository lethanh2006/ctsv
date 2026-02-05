import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import SelectActivitiesTypeDomain from '@/pages/DanhMuc/CCD/components/Select';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { primaryColor } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus, EparticipantRole, EParticipantScope } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, CloseCircleOutlined, RedoOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, message, Row, Space, Table, Tag, Upload } from 'antd';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalDieuPhoiActivityStudent from './ModalDieuPhoi';
import ModalChinhSuaImpact from './ModalImpact';
import ModalXuLyActivityStudent from './ModalXuLy';

const uploadFilesOfCompetency = async (file: any[]) => {
	if (!file?.length) return [];

	const urls = await Promise.all(file.map((f) => handleSingleFile(f).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const FormPerstionActivityOutCome = (props: any) => {
	const { getData, tabActive } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('cct.activityoutcome');
	const { danhSach: dsLevels } = useModel('danhmuc.levels');
	const { danhSach: dsRoles } = useModel('danhmuc.roles');
	const { danhSach: dsActivity } = useModel('danhmuc.activities');

	const startDate: Date = Form.useWatch('startDate', form);
	const rolesId: string = Form.useWatch('rolesId', form);
	const levelsId: string = Form.useWatch('levelsId', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);
	const evidenceFile = Form.useWatch('evidenceFile', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);

	const autoLevel = dsLevels?.find((i) => i?._id === levelsId)?.autoApproval;
	const autoRole = dsRoles?.find((i) => i?._id === rolesId)?.autoApproval;
	const activity = dsActivity?.find((i) => i?._id === activitiesTypeId);

	const [visibleImpact, setVisibleImpact] = useState<boolean>(false);
	const [visibleDieuPhoi, setVisibleDieuPhoi] = useState<boolean>(false);
	const [visibleXuLy, setVisibleXuLy] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<{
		title: string;
		trangThai: EApprovalStatus;
	}>();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form, {
				listAchievedCompetencies: null,
				evidenceFile: [],
			});
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.ALL,
				cct: true,
				allowPostEventResultsUpdate: false,
				onCampus: true,
				evidenceFile: [],
			});
		}
	}, [record?._id, visibleForm]);

	const competencieList = uniqBy(activity?.requiredEvidenceList?.map((i) => ({ name: i })) || [], 'name')?.map(
		(competency) => {
			const matchedEvidence = evidenceFile?.find((ev: any) => ev.name === competency.name);

			return {
				...competency,
				file: matchedEvidence?.file || [],
			};
		},
	);

	const getEvidenceFileByName = (name: string) => {
		return evidenceFile.find((i: any) => i.name === name)?.file || [];
	};

	const setEvidenceFileByName = (name: string, fileList: any[]) => {
		form.setFieldsValue({
			evidenceFile: [...evidenceFile.filter((i: any) => i.name !== name), { name, file: fileList }],
		});
	};

	const hasAtLeastOneEvidenceFile = (evidenceFile: any[]) => evidenceFile.some((i) => i?.file?.length > 0);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		const evidenceFile = await Promise.all(
			(values.evidenceFile || []).map(async (item: any) => ({
				name: item.name,
				file: await uploadFilesOfCompetency(item.file || []),
			})),
		);

		if (autoLevel && autoRole && !hasAtLeastOneEvidenceFile(evidenceFile)) {
			message.warning('You must upload at least one evidence file for auto approval.');
			return;
		}

		values.evidenceFile = evidenceFile;

		const listAchievedCompetencies: any = [];

		values.listAchievedCompetencies?.map((item: any) =>
			item?.competencieId?.forEach((element: any) => {
				listAchievedCompetencies.push({
					competencieId: element,
					attributesId: item?.attributesId,
				});
			}),
		);

		values.listAchievedCompetencies = listAchievedCompetencies;

		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} else {
			postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
		}
	};

	const columns = [
		{
			title: 'Evidence',
			dataIndex: 'name',
		},
		{
			title: 'File',
			dataIndex: 'file',
			render: (_: any, r: any) =>
				isView ? (
					_ ? (
						<Space wrap>
							{_?.map((item: any) => (
								<Tag style={{ cursor: 'pointer' }} onClick={() => window.open(item)} color={primaryColor}>
									Detail
								</Tag>
							))}
						</Space>
					) : (
						<i className='text-warning'>No info</i>
					)
				) : (
					<Upload
						multiple
						beforeUpload={() => false}
						fileList={getEvidenceFileByName(r.name)}
						onChange={({ fileList }) => setEvidenceFileByName(r.name, fileList)}
					>
						<Button size='small' disabled={isView}>
							Upload
						</Button>
					</Upload>
				),
		},
	];

	const columnsCompetency: IColumn<Competency.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'competency.column.name' }),
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			width: 250,
			render: (val, rec) => val && <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Card
			title={
				edit
					? 'Edit Personal Co-curricular Activity'
					: isView
						? 'Detail Personal Co-curricular Activity'
						: 'Add new Personal Co-curricular Activity'
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='activitiesTypeDomainId' label='Activity Group' rules={[...rules.required]}>
							<SelectActivitiesTypeDomain disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='activitiesTypeId' label='Activity type' rules={[...rules.required]}>
							<SelectActivitiesManagement
								condition={{ activitiesTypeDomainId: activitiesTypeDomainId }}
								disabled={isView}
								onChange={(val, option) => {
									const rawData = option?.rawData;
									if (!rawData) return;

									form.setFieldsValue({
										listAchievedCompetencies: (rawData.attributes || []).map((attr: any) => ({
											attributesId: attr._id,
											attributes: attr,
										})),
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='activitiesOutcomeName' label='Activity Name' rules={[...rules.required]}>
							<Input placeholder='Enter Activity Name' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='organizer' label='Organizer' rules={[...rules.required]}>
							<Input placeholder='Enter Organizer' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='location' label='Location' rules={[...rules.required]}>
							<Input placeholder='Enter location' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='startDate' label='Start date' rules={[...rules.required]}>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								placeholder='Select start date'
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='endDate'
							label='End date'
							rules={[...rules.required, ...rules.sauNgay(dayjs(startDate), 'Start date')]}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								disabledDate={(cur) => (startDate ? dayjs(cur).isBefore(startDate) : false)}
								placeholder='Select end date'
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='rolesId' label='Role' rules={[...rules.required]}>
							<SelectRolesManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='levelsId' label='Level' rules={[...rules.required]}>
							<SelectLevelsManagement disabled={isView} />
						</Form.Item>
					</Col>
					{/* <Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							Competency Mapping
						</Divider>
					</Col>
					<Col span={24}>
						{record?._id ? (
							<CompetencyMappingModelPage disabled={isView} />
						) : (
							<Form.Item name='listAchievedCompetencies'>
								<FormItemCompetencyMapping disabled={isView} />
							</Form.Item>
						)}
					</Col> */}
					<Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							Evidence Required
						</Divider>
					</Col>
					<Col span={24}>
						<Form.Item name='evidenceFile'>
							<Table rowKey='name' pagination={false} dataSource={competencieList} columns={columns} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							List competency
						</Divider>
					</Col>

					<Col span={24}>
						<Form.Item name='competencyList'>
							<TableStaticData columns={columnsCompetency} data={record?.competencyList ?? []} size='small' hasTotal />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='reflection' label='Reflection'>
							<Input.TextArea rows={3} disabled={isView} placeholder='Enter reflection' />
						</Form.Item>
					</Col>
					{/* <Col span={24}>
						<Form.Item name='description' label='Description'>
							<Input.TextArea rows={3} placeholder='Enter Description' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='learningOutcomes' label='Learning outcomes'>
							<Input.TextArea rows={3} placeholder='Enter Learning outcomes' disabled={isView} />
						</Form.Item>
					</Col> */}
				</Row>

				<div className='form-footer'>
					{tabActive === 'IMPACT' && (
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
					)}
					{tabActive === 'STUDENT_DECLARATION_APPROVERS' && (
						<Button
							type='primary'
							onClick={() => {
								setVisibleDieuPhoi(true);
							}}
							icon={<UserSwitchOutlined />}
						>
							Declaration Approvers
						</Button>
					)}

					{tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR && (
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

					{!isView && (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.chinhsua' })}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>

			<ModalChinhSuaImpact
				visible={visibleImpact}
				setVisible={setVisibleImpact}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>

			<ModalDieuPhoiActivityStudent
				visible={visibleDieuPhoi}
				setVisible={setVisibleDieuPhoi}
				getData={() => {
					getData();
					setVisibleForm(false);
				}}
			/>

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
		</Card>
	);
};

export default FormPerstionActivityOutCome;
