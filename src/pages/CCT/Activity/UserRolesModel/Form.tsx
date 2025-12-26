import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import { Activity } from '@/services/CCT/Activity/typing';
import { EparticipantRole, mapNameParticipantRole } from '@/services/CCT/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row, Segmented } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormUserRolesModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData, participantRole: participantRoleExtra } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting } = useModel('cct.userroles');

	const participantRole: EparticipantRole = Form.useWatch('participantRole', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				participantRole:
					participantRoleExtra === EparticipantRole.ALL ? EparticipantRole.STUDENT : participantRoleExtra,
			});
		}
	}, [visibleForm, participantRole]);

	const onFinish = async (values: Activity.IParticipantsList) => {
		postModel(
			{
				...values,
				activitiesId: recActivity?._id,
			},
			getData,
			undefined,
			intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
		)
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='participantRole'>
						<Segmented
							options={Object.values(
								participantRoleExtra === EparticipantRole.ALL
									? [EparticipantRole.STUDENT, EparticipantRole.STAFF]
									: [participantRoleExtra],
							).map((item) => ({
								value: item,
								label: mapNameParticipantRole[item as EparticipantRole],
							}))}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					{participantRole === EparticipantRole.STAFF ? (
						<>
							<Form.Item name='ssoId' label={intl.formatMessage({ id: 'activity.info.participantsList.form.staff' })}>
								<SelectNhanSuDebounce
									onChange={(val, option) => {
										const nhanSu = option?.rawData;
										form.setFieldsValue({
											name: nhanSu?.hoTen ? nhanSu?.hoTen : [nhanSu?.hoDem, nhanSu?.ten].filter(Boolean).join(' '),
											email: nhanSu?.emailCanBo ?? nhanSu?.email,
										});
									}}
								/>
							</Form.Item>
							<Form.Item name='name' hidden />
							<Form.Item name='email' hidden />
						</>
					) : (
						<>
							<Form.Item name='ssoId' label={intl.formatMessage({ id: 'activity.info.participantsList.form.student' })}>
								<SelectSinhVienDebounce
									onChange={(val, option) => {
										const sinhvien = option?.rawData;
										form.setFieldsValue({
											name: sinhvien?.ten,
											email: sinhvien?.email,
										});
									}}
								/>
							</Form.Item>
							<Form.Item name='name' hidden />
							<Form.Item name='email' hidden />
						</>
					)}
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.chinhsua' })}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Form>
	);
};

export default FormUserRolesModel;
