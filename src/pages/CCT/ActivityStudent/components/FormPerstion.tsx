import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import SelectLevelsManagement from '@/pages/DanhMuc/Levels/components/Select';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EparticipantRole, EParticipantScope } from '@/services/CCT/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemCompetencyMapping from '../CompetencyMapping/FormItem';
import CompetencyMappingModelPage from '../CompetencyMappingModel';

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('cct.activityoutcome');
	const { danhSach: dsActivitiType } = useModel('danhmuc.activities');

	const startDate: Date = Form.useWatch('startDate', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		// else if (record?._id)
		// 	form.setFieldsValue({
		// 		...record,
		// 		listAchievedCompetencies: record?.listAchievedCompetencies?.map((item) => item?.competencieId),
		// 	});

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

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		setFormSubmiting(true);
		const file = await buildUpLoadMultiFile(values, 'file');
		values.file = file;
		setFormSubmiting(false);

		// values.listAchievedCompetencies = values.listAchievedCompetencies?.map((item) => ({
		// 	competencieId: item,
		// })) as any;

		values.listAchievedCompetencies = values.listAchievedCompetencies?.map((item) => ({
			activityOutcomeId: record?._id ?? '',
			competencieId: item.competencieId,
		})) as any;

		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={intl.formatMessage({ id: 'activityresult.perstion.title' })}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='activitiesOutcomeName'
							label={intl.formatMessage({ id: 'activityresult.perstion.activitiesOutcomeName' })}
							rules={[...rules.required]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'activityresult.perstion.activitiesOutcomeName.place' })}
								disabled={isView}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='activitiesTypeId'
							label={intl.formatMessage({ id: 'activityresult.perstion.activitiesTypeId' })}
							rules={[...rules.required]}
						>
							<SelectActivitiesManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label={intl.formatMessage({ id: 'activityresult.perstion.activitiesTypeId.mapping' })}>
							<Input
								disabled
								value={
									dsActivitiType?.find((item) => item?._id === activitiesTypeId)?.attributes?.name ??
									intl.formatMessage({ id: 'activityresult.perstion.activitiesTypeId.select' })
								}
							/>
						</Form.Item>
					</Col>

					{/* <Col span={24}>
						<Form.Item name='listAchievedCompetencies' label='Competency Mapping'>
							<SelectCompetency multiple />
						</Form.Item>
					</Col> */}

					<Col span={24}>
						{record?._id ? (
							<>
								<div className='fw500'>Competency Mapping</div>
								<CompetencyMappingModelPage disabled={isView} />
							</>
						) : (
							<Form.Item name='listAchievedCompetencies' label='Competency Mapping'>
								<FormItemCompetencyMapping disabled={isView || !activitiesTypeId} />
							</Form.Item>
						)}
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='startDate'
							label={intl.formatMessage({ id: 'activityresult.perstion.startDate' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'activityresult.perstion.startDate.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='endDate'
							label={intl.formatMessage({ id: 'activityresult.perstion.endDate' })}
							rules={[
								...rules.required,
								...rules.sauNgay(dayjs(startDate), intl.formatMessage({ id: 'activity.perstion.startDate' })),
							]}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								disabledDate={(cur) => (startDate ? dayjs(cur).isBefore(startDate) : false)}
								placeholder={intl.formatMessage({ id: 'activityresult.perstion.endDate.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='organizer'
							label={intl.formatMessage({ id: 'activityresult.perstion.organizer' })}
							rules={[...rules.required]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'activityresult.perstion.organizer.place' })}
								disabled={isView}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='location'
							label={intl.formatMessage({ id: 'activityresult.perstion.location' })}
							rules={[...rules.required]}
						>
							<Input placeholder='Enter location' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='description' label={intl.formatMessage({ id: 'activityresult.perstion.description' })}>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'activityresult.perstion.description.place' })}
								disabled={isView}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='rolesId'
							label={intl.formatMessage({ id: 'activityresult.perstion.rolesId' })}
							rules={[...rules.required]}
						>
							<SelectRolesManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='levelsId' label='Level' rules={[...rules.required]}>
							<SelectLevelsManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='learningOutcomes'
							label={intl.formatMessage({ id: 'activityresult.perstion.learningOutcomes' })}
						>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'activityresult.perstion.learningOutcomes.place' })}
								disabled={isView}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='file' label={intl.formatMessage({ id: 'activityresult.perstion.file' })}>
							<UploadFile maxCount={5} disabled={isView} />
						</Form.Item>
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
		</Card>
	);
};

export default FormPerstionActivityOutCome;
