import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectPhongCSVC from '@/pages/CoSoVatChat/Phong/Select';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import SelectActivitiesTypeDomain from '@/pages/DanhMuc/CCD/components/Select';
import StudenDomainModelPage from '@/pages/DanhMuc/CCD/StudenModel';
import FormItemStudentDomain from '@/pages/DanhMuc/CCD/Student/FormItem';
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
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemCompetencyMapping from '../CompetencyMapping/FormItem';
import CompetencyMappingModelPage from '../CompetencyMappingModel';
import FormItemUserRoles from '../UserRoles/FormItem';
import UserRolesModelPage from '../UserRolesModel';
import GroupTagVaiTro from './GroupTagVaiTro';

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

	const startDate: Date = Form.useWatch('startDate', form);
	const endDate: Date = Form.useWatch('endDate', form);
	const onCampus: Boolean = Form.useWatch('onCampus', form);
	const participantScope: EParticipantScope = Form.useWatch('participantScope', form);
	const cct: boolean = Form.useWatch('cct', form);
	const participantRole: EparticipantRole = Form.useWatch('participantRole', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);
	const allowPostEventResultsUpdate: boolean = Form.useWatch('allowPostEventResultsUpdate', form);

	useEffect(() => {
		if (!visibleForm)
			resetFieldsForm(form, { coCurricularAttributesEquivalency: null, studentDeclarationApproverList: null });
		else if (record?._id)
			form.setFieldsValue({
				...record,
				cct: record?.activitiesTypeId ?? false,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
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
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Activity.IRecord) => {
		setFormSubmiting(true);
		const banner = await buildUpLoadFile(values, 'banner');
		const backgroundImage = await buildUpLoadFile(values, 'backgroundImage');
		values.banner = banner;
		values.backgroundImage = backgroundImage;
		setFormSubmiting(false);

		const coCurricularAttributesEquivalency: any = [];

		values.coCurricularAttributesEquivalency?.map((item: any) =>
			item?.competencieId?.forEach((element: any) => {
				coCurricularAttributesEquivalency.push({
					competencieId: element,
					attributesId: item?.attributesId,
				});
			}),
		);

		values.coCurricularAttributesEquivalency = coCurricularAttributesEquivalency;

		if (values.cct === false) {
			values.activitiesTypeId = null;
		}

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
			postModel(values, getData, false, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then((rec) => {
					setRecord({ ...rec, ...record });
					setEdit(true);
					if (afterAddNew && rec?.activitiesTypeId) {
						afterAddNew(rec);
					} else setVisibleForm(false);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item name='banner' label={intl.formatMessage({ id: 'activity.info.form.banner' })}>
						<UploadFile disabled={isView} accept='.png, .jpeg, .jpg' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='backgroundImage' label={intl.formatMessage({ id: 'activity.info.form.backgroundImage' })}>
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
						<Form.Item name='facilityName' />
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
						record?._id ? (
							<>
								<div className='fw500' style={{ marginBottom: 8 }}>
									{intl.formatMessage({ id: 'activity.info.form.participantsList' })}
								</div>
								<UserRolesModelPage disabled={isView} participantRole={participantRole} />
							</>
						) : (
							<Form.Item
								name='participantsList'
								label={intl.formatMessage({ id: 'activity.info.form.participantsList' })}
							>
								<FormItemUserRoles disabled={isView} participantRole={participantRole} />
							</Form.Item>
						)
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
						<Col span={24} md={12}>
							<Form.Item name='allowPostEventResultsUpdate' valuePropName='checked'>
								<Checkbox disabled={isView}>
									{intl.formatMessage({ id: 'activity.info.form.allowPostEventResultsUpdate' })}
								</Checkbox>
							</Form.Item>
						</Col>

						{allowPostEventResultsUpdate && (
							<Col span={24} md={12}>
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
							</Col>
						)}
					</Row>
				</Col>

				<Col span={24}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='cct' valuePropName='checked'>
								<Checkbox disabled={isView}>{intl.formatMessage({ id: 'activity.info.form.cct' })}</Checkbox>
							</Form.Item>
						</Col>

						{cct && (
							<>
								<Col span={24} md={8}>
									<Form.Item
										name='activitiesTypeDomainId'
										label={intl.formatMessage({ id: 'activity.info.form.ccd' })}
										rules={[...rules.required]}
									>
										<SelectActivitiesTypeDomain
											disabled={isView}
											onChange={() => form.resetFields(['activitiesTypeId'])}
										/>
									</Form.Item>
								</Col>

								<Col span={24} md={8}>
									<Form.Item
										name='activitiesTypeId'
										label={intl.formatMessage({ id: 'activity.info.form.activitiesTypeId' })}
										rules={[...rules.required]}
									>
										<SelectActivitiesManagement
											disabled={isView}
											condition={{ activitiesTypeDomainId: activitiesTypeDomainId }}
											onChange={(val, option) => {
												const rawData = option?.rawData;

												const old = form.getFieldValue('coCurricularAttributesEquivalency') || [];

												form.setFieldsValue({
													coCurricularAttributesEquivalency: [
														{
															attributesId: rawData?.attributesId,
															attributes: rawData?.attributes,
														},
														...old.slice(1),
													],
												});
											}}
										/>
									</Form.Item>
								</Col>

								<Col span={24}>
									{record?._id ? (
										<>
											<div className='fw500'>
												{intl.formatMessage({ id: 'activity.info.form.activitiesTypeId.mapping' })}
											</div>
											<CompetencyMappingModelPage disabled={isView} />
										</>
									) : (
										<Form.Item
											name='coCurricularAttributesEquivalency'
											label={intl.formatMessage({ id: 'activity.info.form.activitiesTypeId.mapping' })}
										>
											<FormItemCompetencyMapping disabled={isView || !activitiesTypeId} />
										</Form.Item>
									)}
								</Col>

								<Col span={24}>
									{record?._id ? (
										<>
											<div className='fw500'>{intl.formatMessage({ id: 'activity.info.form.student' })}</div>
											<StudenDomainModelPage disabled={isView} mode='activity' />
										</>
									) : (
										<Form.Item
											name='studentDeclarationApproverList'
											label={intl.formatMessage({ id: 'activity.info.form.student' })}
										>
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
