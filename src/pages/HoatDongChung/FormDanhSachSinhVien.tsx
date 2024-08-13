import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectSinhVienDebounce from '../DaoTaoV2/SinhVien/component/Select';
import { TrangThaiThamGia } from '@/services/HoatDongChung/constants';

const FormDanhSachSinhVien = (props: { getData: any; hoatDongCtsvId: string; trangThai: string }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, formSubmiting, visibleForm } = useModel('danhsachsinhvienhoatdong');

	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [record?._id, visibleForm]);
	const onFinish = async (values: any) => {
		const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === values?.ssoId);
		const payload = {
			...values,
			ma: recSinhVien?.ma,
			ten: recSinhVien?.ten,
			maNganh: recSinhVien?.nganh?.ma,
			tenNganh: recSinhVien?.nganh?.ten,
			hoatDongCtsvId: props.hoatDongCtsvId,
			trangThaiThamGia: props.trangThai === 'tham-gia' ? TrangThaiThamGia.THAM_GIA : undefined,
		};
		postModel(payload, props.getData);
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'danh mục chung'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='ssoId' label='Sinh viên' rules={[...rules.required]}>
					<SelectSinhVienDebounce />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDanhSachSinhVien;
