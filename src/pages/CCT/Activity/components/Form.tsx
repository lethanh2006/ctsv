import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectPhongCSVC from '@/pages/CoSoVatChat/Phong/Select';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import StudenModelPage from '@/pages/DanhMuc/Activities/StudenModel';
import FormItemStudent from '@/pages/DanhMuc/Activities/Student/FormItem';
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
import FormItemUserRoles from '../UserRoles/FormItem';
import GroupTagVaiTro from './GroupTagVaiTro';

const FormActivity = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { danhSach: dsActivitiType } = useModel('danhmuc.activities');
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('cct.activity');

	const startDate: Date = Form.useWatch('startDate', form);
	const onCampus: Boolean = Form.useWatch('onCampus', form);
	const participantScope: EParticipantScope = Form.useWatch('participantScope', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				cct: record?.activitiesTypeId ?? false,
			});

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.USER_LIST,
				participantRole: EparticipantRole.ALL,
				cct: false,
				allowPostEventResultsUpdate: false,
				onCampus: true,
			});
		}
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: Activity.IRecord) => {
		setFormSubmiting(true);
		const banner = await buildUpLoadFile(values, 'banner');
		const backgroundImage = await buildUpLoadFile(values, 'backgroundImage');
		values.banner = banner;
		values.backgroundImage = backgroundImage;
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item name='banner' label='Banner' rules={[...rules.required]}>
						<UploadFile disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='backgroundImage' label='Background' rules={[...rules.required]}>
						<UploadFile disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='name' label='Activity name' rules={[...rules.required]}>
						<Input disabled={isView} placeholder='Enter Activity name' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='startDate' label='Start Date' rules={[...rules.required]}>
						<MyDatePicker disabled={isView} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='endDate' label='End Date' rules={[...rules.required, ...rules.sauNgay(dayjs(startDate))]}>
						<MyDatePicker
							disabled={isView}
							disabledDate={(cur) => (startDate ? dayjs(cur).isBefore(startDate) : false)}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='organizer' label='Organizer' rules={[...rules.required]}>
						<Input disabled={isView} placeholder='Enter Organizer' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='onCampus' label='Location' rules={[...rules.required]}>
						<Radio.Group
							options={[
								{ value: true, label: 'On-campus' },
								{ value: false, label: 'Other location' },
							]}
						/>
					</Form.Item>
				</Col>

				{onCampus ? (
					<Col span={24} md={12}>
						<Form.Item name='facilityCode' label='On-campus' rules={[...rules.required]}>
							<SelectPhongCSVC
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
						<Form.Item name='otherAddress' label='Other location' rules={[...rules.required]}>
							<Input disabled={isView} placeholder='Enter Other location' />
						</Form.Item>
					</Col>
				)}

				<Col span={24}>
					<Form.Item name='description' label='Description' rules={[...rules.text]}>
						<Input.TextArea rows={3} disabled={isView} placeholder='Enter Description' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='participantScope' label='Participant List' rules={[...rules.required]}>
						<Select
							options={Object.values(EParticipantScope).map((item) => ({
								value: item,
								label: mapNameParticipantScope[item],
							}))}
							placeholder='Select Participant List'
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='participantRole' label='Participant Role' rules={[...rules.required]}>
						<GroupTagVaiTro
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
						<Form.Item name='participantsList' label='Participants user list'>
							<FormItemUserRoles />
						</Form.Item>
					) : participantScope === EParticipantScope.STUDENT ? (
						<Form.Item name='studentCohortCode' label='Khóa sinh viên' rules={[...rules.required]}>
							<SelectKhoaSinhVien selectMa allowClear />
						</Form.Item>
					) : participantScope === EParticipantScope.MAJOR ? (
						<Form.Item name='majorCode' label='Ngành học' rules={[...rules.required]}>
							<SelectNganhCoSo selectMa allowClear />
						</Form.Item>
					) : participantScope === EParticipantScope.COURSE_CLASS ? (
						<Form.Item name='courseClassCode' label='Lớp học phần' rules={[...rules.required]}>
							<SelectLopHocPhanDebounce selectMa allowClear />
						</Form.Item>
					) : participantScope === EParticipantScope.UNIT ? (
						<Form.Item name='unitCode' label='Đơn vị' rules={[...rules.required]}>
							<SelectDonVi selectMa allowClear />
						</Form.Item>
					) : null}
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='cct' valuePropName='checked'>
						<Checkbox>CCT Transcript</Checkbox>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='allowPostEventResultsUpdate' valuePropName='checked'>
						<Checkbox>Allow post-event results update</Checkbox>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='activitiesTypeId' label='Co-curricular Activities (CCA)'>
						<SelectActivitiesManagement />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item label='EXCEL competency mapping'>
						<Input disabled value={dsActivitiType?.find((item) => item?._id === activitiesTypeId)?.attributes?.name} />
					</Form.Item>
				</Col>

				<Col span={24}>
					{record?._id ? (
						<>
							<div className='fw500' style={{ marginBottom: 8 }}>
								Student Declaration Approver
							</div>
							<StudenModelPage disabled={isView} mode='activity' />
						</>
					) : (
						<Form.Item name='studentDeclarationApproverList' label='Student Declaration Approver'>
							<FormItemStudent />
						</Form.Item>
					)}
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
