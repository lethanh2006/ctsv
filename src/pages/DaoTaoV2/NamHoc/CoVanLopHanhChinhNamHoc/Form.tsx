import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLopHanhChinhCondition from '../LopHanhChinh/components/SelectLopHanhChinhCondition';
import SelectNamHoc from '../NamHoc/components/Select';

const FormBanCanSuLop = (props: { getData: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, edit, postModel, putModel, formSubmiting } = useModel(
		'daotaov2.lophcnsnamhoc.lophcnsnamhoc',
	);
	const { danhSach: danhSachNhanSu } = useModel('tochucnhansu.nhansu');
	const { record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else {
			form.setFieldsValue({
				...record,
				tenLopHc: record?.tenLopHc || recLopHanhChinh?.ten,
				maNamHoc: record?.maNamHoc || recNamHoc?.ma,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const recNhanSu = danhSachNhanSu.find((item) => item.ssoId === values?.nhanSuSsoId);
		const payload = {
			...values,
			maNhanSu: recNhanSu?.maCanBo,
			hoTenNhanSu: recNhanSu?.hoTen,
		};
		if (edit) {
			putModel(record?._id ?? '', payload, props.getData);
		} else {
			postModel(payload, props.getData);
		}
	};

	return (
		<Card title={!edit ? 'Thêm cố vấn học tập' : 'Chỉnh sửa cố vấn học tập'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item rules={[...rules.required]} name='maNamHoc' label='Năm học'>
					<SelectNamHoc selectMa />
				</Form.Item>
				<Form.Item rules={[...rules.required]} name='tenLopHc' label='Lớp hành chính'>
					<SelectLopHanhChinhCondition keyName='ten' />
				</Form.Item>
				<Form.Item rules={[...rules.required]} name='nhanSuSsoId' label='Cán bộ/giảng viên'>
					<SelectNhanSuDebounce />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormBanCanSuLop;
