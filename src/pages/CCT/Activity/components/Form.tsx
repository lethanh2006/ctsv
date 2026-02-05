import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import SelectPhongCSVC from '@/pages/CoSoVatChat/Phong/Select';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import StudenDomainModelPage from '@/pages/DanhMuc/Activities/StudenModel';
import FormItemStudentDomain from '@/pages/DanhMuc/Activities/Student/FormItem';
import SelectActivitiesTypeDomain from '@/pages/DanhMuc/CCD/components/Select';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectLopHocPhanDebounce from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/SinhVien/KhoaSinhVien/SelectKhoaSinhVien';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import { EparticipantRole, EParticipantScope, mapNameParticipantScope } from '@/services/CCT/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Divider, Form, Input, message, Radio, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import EquivalencyForm from '../Equivalency/Form';
import EquivalencyFormItem from '../Equivalency/FormItem';
import FormItemUserRoles from '../UserRoles/FormItem';
import UserRolesModelPage from '../UserRolesModel';
import GroupTagVaiTro from './GroupTagVaiTro';

const MAX_SELECT = 3;

const FormActivity = (props: { afterAddNew?: (rec: Activity.IRecord) => void; getData?: () => void }) => {
	const intl = useIntl();
	const { afterAddNew, getData } = props;
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		isView,
		postModel,
		putModel,
		formSubmiting,
		visibleForm,
		setFormSubmiting,
		setRecord,
		setEdit,
	} = useModel('cct.activity');
	const { danhSach: dsActivityType } = useModel('danhmuc.activities');
	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('danhmuc.competency');

	const startDate: Date = Form.useWatch('startDate', form);
	const endDate: Date = Form.useWatch('endDate', form);
	const onCampus: Boolean = Form.useWatch('onCampus', form);
	const participantScope: EParticipantScope = Form.useWatch('participantScope', form);
	const cct: boolean = Form.useWatch('cct', form);
	const participantRole: EparticipantRole = Form.useWatch('participantRole', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const allowPostEventResultsUpdate: boolean = Form.useWatch('allowPostEventResultsUpdate', form);
	// const coCurricularAttributesEquivalency = Form.useWatch('coCurricularAttributesEquivalency', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);
	const competencyList: string[] = Form.useWatch('competencyList', form);

	useEffect(() => {
		if (!visibleForm)
			resetFieldsForm(form, {
				coCurricularAttributesEquivalency: null,
				studentDeclarationApproverList: null,
				coCurricularActivityEquivalency: null,
			});

		if (record?._id)
			form.setFieldsValue({
				...record,
				cct: record?.activitiesTypeId ?? false,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
				competencyList: record?.competencyList?.map((item) => item?.competencyId),
			});

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.ALL,
				cct: true,
				allowPostEventResultsUpdate: false,
				onCampus: true,
			});
		}

		getAllAttriCompetency();
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Activity.IRecord) => {
		setFormSubmiting(true);
		const banner = await buildUpLoadFile(values, 'banner');
		const backgroundImage = await buildUpLoadFile(values, 'backgroundImage');
		values.banner = banner;
		values.backgroundImage = backgroundImage;
		setFormSubmiting(false);

		// const coCurricularAttributesEquivalency: any = [];
		// values.coCurricularAttributesEquivalency?.map((item: any) =>
		// 	item?.competencieId?.forEach((element: any) => {
		// 		coCurricularAttributesEquivalency.push({
		// 			competencieId: element,
		// 			attributesId: item?.attributesId,
		// 		});
		// 	}),
		// );
		// values.coCurricularAttributesEquivalency = coCurricularAttributesEquivalency;

		values.competencyList = values.competencyList?.map((id) => ({
			competencyId: id,
		})) as any;

		if (values.cct === false) {
			values.activitiesTypeId = null;
		}

		const list = values.coCurricularActivityEquivalency || [];

		const roleIds = list.map((i) => i.rolesId).filter(Boolean);
		if (roleIds.some((id, idx) => roleIds.indexOf(id) !== idx)) {
			message.error(intl.formatMessage({ id: 'activity.equivalency.vali' }));
			return;
		}

		const result: any[] = [];

		list.forEach((item: any) => {
			const { rolesId, attributes = {} } = item;

			const selectedAttributeIds = Object.keys(attributes).filter((id) => attributes[id]);

			if (!selectedAttributeIds.length) {
				result.push({
					rolesId,
					attributesId: null,
				});
				return;
			}

			selectedAttributeIds.forEach((attrId) => {
				result.push({
					rolesId,
					attributesId: attrId,
				});
			});
		});

		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				getData,
				undefined,
				false,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then((rec) => {
					setRecord({ ...rec, ...record });
					if (afterAddNew && rec?.activitiesTypeId) {
						afterAddNew(rec);
					} else setVisibleForm(false);
				})
				.catch((er) => console.log(er));
		} else
			postModel(
				{ ...values, coCurricularActivityEquivalency: result },
				getData,
				false,
				intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
			)
				.then((rec) => {
					setRecord({ ...rec, ...record });
					setEdit(true);
					if (afterAddNew && rec?.activitiesTypeId) {
						afterAddNew(rec);
					} else setVisibleForm(false);
				})
				.catch((er) => console.log(er));
	};

	const columns: IColumn<Competency.IRecord>[] = [
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
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item
						name='banner'
						label={intl.formatMessage({ id: 'activity.info.form.banner' })}
						extra='Only .png, .jpeg, and .jpg files are allowed'
					>
						<UploadFile disabled={isView} accept='.png, .jpeg, .jpg' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='backgroundImage'
						label={intl.formatMessage({ id: 'activity.info.form.backgroundImage' })}
						extra='Only .png, .jpeg, and .jpg files are allowed'
					>
						<UploadFile disabled={isView} accept='.png, .jpeg, .jpg' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='name'
						label={intl.formatMessage({ id: 'activity.info.form.name' })}
						rules={[...rules.required]}
					>
						<Input disabled={isView} placeholder={intl.formatMessage({ id: 'activity.info.form.name.place' })} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='startDate'
						label={intl.formatMessage({ id: 'activity.info.form.startDate' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							showTime={{ showHour: true, showMinute: true }}
							format='HH:mm DD/MM/YYYY'
							disabled={isView}
							placeholder={intl.formatMessage({ id: 'activity.info.form.startDate.place' })}
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='endDate'
						label={intl.formatMessage({ id: 'activity.info.form.endDate' })}
						rules={[
							...rules.required,
							...rules.sauNgay(dayjs(startDate), intl.formatMessage({ id: 'activity.info.form.startDate' })),
						]}
					>
						<MyDatePicker
							showTime={{ showHour: true, showMinute: true }}
							format='HH:mm DD/MM/YYYY'
							disabled={isView}
							disabledDate={(cur) => (startDate ? dayjs(cur).isBefore(startDate) : false)}
							placeholder={intl.formatMessage({ id: 'activity.info.form.endDate.place' })}
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item
						name='organizer'
						label={intl.formatMessage({ id: 'activity.info.form.organizer' })}
						rules={[...rules.required]}
					>
						<Input disabled={isView} placeholder={intl.formatMessage({ id: 'activity.info.form.organizer.place' })} />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='onCampus'
						label={intl.formatMessage({ id: 'activity.info.form.location' })}
						rules={[...rules.required]}
					>
						<Radio.Group
							disabled={isView}
							options={[
								{ value: true, label: intl.formatMessage({ id: 'activity.info.form.location.onCampus' }) },
								{ value: false, label: intl.formatMessage({ id: 'activity.info.form.location.otherAddress' }) },
							]}
						/>
					</Form.Item>
				</Col>

				{onCampus ? (
					<Col span={24} md={12}>
						<Form.Item
							name='facilityCode'
							label={intl.formatMessage({ id: 'activity.info.form.location.onCampus' })}
							rules={[...rules.required]}
						>
							<SelectPhongCSVC
								disabled={isView}
								onChange={(val, option) => {
									const phong = option?.rawData;
									form.setFieldsValue({
										facilityName: phong?.ten,
									});
								}}
							/>
						</Form.Item>
						<Form.Item name='facilityName' hidden />
					</Col>
				) : (
					<Col span={24} md={12}>
						<Form.Item
							name='otherAddress'
							label={intl.formatMessage({ id: 'activity.info.form.location.otherAddress' })}
							rules={[...rules.required]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'activity.info.form.location.otherAddress.place' })}
							/>
						</Form.Item>
					</Col>
				)}

				<Col span={24}>
					<Form.Item
						name='description'
						label={intl.formatMessage({ id: 'activity.info.form.description' })}
						rules={[...rules.text]}
					>
						<Input.TextArea
							rows={3}
							disabled={isView}
							placeholder={intl.formatMessage({ id: 'activity.info.form.description.place' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='participantScope'
						label={intl.formatMessage({ id: 'activity.info.form.participantScope' })}
						rules={[...rules.required]}
					>
						<Select
							disabled={isView}
							options={Object.values(EParticipantScope).map((item) => ({
								value: item,
								label: mapNameParticipantScope[item],
							}))}
							placeholder={intl.formatMessage({ id: 'activity.info.form.participantScope.place' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='participantRole'
						label={intl.formatMessage({ id: 'activity.info.form.participantRole' })}
						rules={[...rules.required]}
					>
						<GroupTagVaiTro
							disabled={isView}
							listVaiTro={
								participantScope === EParticipantScope.UNIT
									? [EparticipantRole.STAFF]
									: [EParticipantScope.COURSE_CLASS, EParticipantScope.STUDENT, EParticipantScope.MAJOR].includes(
												participantScope,
										  )
										? [EparticipantRole.STUDENT]
										: undefined
							}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					{participantScope === EParticipantScope.USER_LIST ? (
						<>
							<Divider className='divider-big-title' orientation='left'>
								{intl.formatMessage({ id: 'activity.info.form.participantsList' })}{' '}
							</Divider>

							{record?._id ? (
								<UserRolesModelPage disabled={isView} participantRole={participantRole} />
							) : (
								<Form.Item name='participantsList'>
									<FormItemUserRoles disabled={isView} participantRole={participantRole} />
								</Form.Item>
							)}
						</>
					) : participantScope === EParticipantScope.STUDENT ? (
						<Form.Item
							name='studentCohortCode'
							label={intl.formatMessage({ id: 'activity.info.form.studentCohortCode' })}
							rules={[...rules.required]}
						>
							<SelectKhoaSinhVien selectMa allowClear disabled={isView} />
						</Form.Item>
					) : participantScope === EParticipantScope.MAJOR ? (
						<Form.Item
							name='majorCode'
							label={intl.formatMessage({ id: 'activity.info.form.majorCode' })}
							rules={[...rules.required]}
						>
							<SelectNganhCoSo selectMa allowClear disabled={isView} />
						</Form.Item>
					) : participantScope === EParticipantScope.COURSE_CLASS ? (
						<Form.Item
							name='courseClassCode'
							label={intl.formatMessage({ id: 'activity.info.form.courseClassCode' })}
							rules={[...rules.required]}
						>
							<SelectLopHocPhanDebounce selectMa allowClear disabled={isView} />
						</Form.Item>
					) : participantScope === EParticipantScope.UNIT ? (
						<Form.Item
							name='unitCode'
							label={intl.formatMessage({ id: 'activity.info.form.unitCode' })}
							rules={[...rules.required]}
						>
							<SelectDonVi selectMa allowClear disabled={isView} />
						</Form.Item>
					) : null}
				</Col>

				<Col span={24}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='cct' valuePropName='checked' label=' '>
								<Checkbox disabled={isView}>{intl.formatMessage({ id: 'activity.info.form.cct' })}</Checkbox>
							</Form.Item>
						</Col>

						{cct && (
							<>
								<Col span={24} md={8}>
									<Form.Item name='allowPostEventResultsUpdate' valuePropName='checked' label=' '>
										<Checkbox disabled={isView}>
											{intl.formatMessage({ id: 'activity.info.form.allowPostEventResultsUpdate' })}
										</Checkbox>
									</Form.Item>
								</Col>

								<Col span={24} md={8}>
									{allowPostEventResultsUpdate && (
										<Form.Item
											name='dueDate'
											label={intl.formatMessage({ id: 'activity.info.form.duedate' })}
											rules={[
												...rules.required,
												...rules.sauNgay(dayjs(endDate), intl.formatMessage({ id: 'activity.info.form.endDate' })),
											]}
										>
											<MyDatePicker
												showTime={{ showHour: true, showMinute: true }}
												format='HH:mm DD/MM/YYYY'
												disabled={isView}
												disabledDate={(cur) => (endDate ? dayjs(cur).isBefore(endDate) : false)}
												placeholder={intl.formatMessage({ id: 'activity.info.form.duedate.place' })}
												allowClear
											/>
										</Form.Item>
									)}
								</Col>

								<Col span={24} md={8}>
									<Form.Item name='activitiesTypeDomainId' label='Activity Group' rules={[...rules.required]}>
										<SelectActivitiesTypeDomain
											disabled={isView}
											onChange={() => form.resetFields(['activitiesTypeId'])}
										/>
									</Form.Item>
								</Col>

								<Col span={24} md={8}>
									<Form.Item name='activitiesTypeId' label='Activity type' rules={[...rules.required]}>
										<SelectActivitiesManagement
											disabled={isView}
											condition={{ activitiesTypeDomainId: activitiesTypeDomainId }}
											onChange={(val, option) => {
												const rawData = option?.rawData;
												if (!rawData) return;

												form.setFieldsValue({
													coCurricularAttributesEquivalency: (rawData.attributes || []).map((attr: any) => ({
														attributesId: attr._id,
														attributes: attr,
													})),
												});
											}}
										/>
									</Form.Item>
								</Col>

								<Col span={24} md={8}>
									<Form.Item label='Track'>
										<Input
											disabled
											value={
												dsActivityType?.find((item) => item?._id === activitiesTypeId)?.track?.name ??
												'Select activity type'
											}
										/>
									</Form.Item>
								</Col>

								{/* <Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										Attributes
									</Divider>
								</Col>

								<Col span={24}>
									{record?._id ? (
										<CompetencyMappingModelPage disabled={isView} />
									) : (
										<Form.Item name='coCurricularAttributesEquivalency'>
											<FormItemCompetencyMapping disabled={isView} />
										</Form.Item>
									)}
								</Col> */}

								<Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										{intl.formatMessage({ id: 'activity.step.cca' })}
									</Divider>
								</Col>

								<Col span={24}>
									{record?._id ? (
										<EquivalencyForm disabled={isView} />
									) : (
										<EquivalencyFormItem
											// coCurricularAttributesEquivalency={coCurricularAttributesEquivalency}
											coCurricularAttributesEquivalency={
												dsActivityType
													?.find((item) => item?._id === activitiesTypeId)
													?.attributes?.map((attr: any) => ({
														attributesId: attr._id,
														attributes: attr,
													})) ?? []
											}
											form={form}
											disabled={isView}
										/>
									)}
								</Col>

								<Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										List competency
									</Divider>
								</Col>

								<Col span={24}>
									<Form.Item name='competencyList'>
										<i className='text-info'>An activity allows a maximum of 3 competencies</i>

										<TableStaticData
											columns={columns}
											data={dscompetency}
											loading={loading}
											size='small'
											hasTotal
											onReload={getAllAttriCompetency}
											otherProps={{
												pagination: false,
												scroll: { y: 350 },
												rowKey: '_id',
												rowSelection: {
													type: 'checkbox',
													columnWidth: 40,
													selectedRowKeys: competencyList ?? [],
													onChange: (selectedRowKeys: React.Key[]) => {
														if (isView) return;
														form.setFieldsValue({
															competencyList: selectedRowKeys,
														});
													},
													getCheckboxProps: (record: any) => ({
														disabled:
															isView ||
															((competencyList?.length ?? 0) >= MAX_SELECT && !competencyList?.includes(record._id)),
													}),
													hideSelectAll: true,
												},
											}}
										/>
									</Form.Item>
								</Col>

								<Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										Approvers
									</Divider>
								</Col>

								<Col span={24}>
									{record?._id ? (
										<StudenDomainModelPage disabled={isView} mode='activity' />
									) : (
										<Form.Item name='studentDeclarationApproverList'>
											<FormItemStudentDomain disabled={isView} />
										</Form.Item>
									)}
								</Col>
							</>
						)}
					</Row>
				</Col>
			</Row>

			<div className='form-footer'>
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
	);
};

export default FormActivity;
