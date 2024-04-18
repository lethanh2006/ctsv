import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { EPhanLoaiSucKhoe, ETinhTrangSucKhoe, MapKeyNameTinhTrangSuckhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSinhVienDotKham = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'hosotheodoisuckhoe.suckhoesinhvien',
	);
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { title } = props;

	const getData = () => getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotKhamSucKhoe.ISucKhoeSinhVien) => {
		const data = {
			...values,
			dotKhamSucKhoeId: recDotKhaiBao?._id ?? '',
		};
		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{/* <Col xs={24}>
						<Form.Item label='Đợt khám sức khỏe'>
							<Input value={recDotKhaiBao?.ten} disabled />
						</Form.Item>
					</Col> */}
					<Col xs={24}>
						<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce disabled={edit} />
						</Form.Item>
					</Col>

					<Col xs={12}>
						<Form.Item rules={[...rules.required, ...rules.text]} label='Mã xét nghiệm' name='maXetNghiem'>
							<Input placeholder='Mã xét nghiệm' />
						</Form.Item>
					</Col>
					<Col xs={12}>
						<Form.Item rules={[...rules.required]} label='Phân loại sức khỏe' name='phanLoaiSucKhoe'>
							<Select
								options={Object.values(EPhanLoaiSucKhoe).map((item) => ({ value: item, label: item }))}
								placeholder='Phân loại sức khỏe'
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item label='Bệnh/tật' name='benhTat'>
							<Input.TextArea placeholder='Bệnh/tật' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label='Tư vấn' name='tuVan'>
							<Input.TextArea placeholder='Tư vấn' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label='Ghi chú' name='ghiChu'>
							<Input.TextArea placeholder='Ghi chú' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='tinhTrangSucKhoe' label='Kết luận' rules={[...rules.required]}>
							<Select
								placeholder='Chọn tình trạng sức khỏe'
								options={Object.values(ETinhTrangSucKhoe).map((item) => ({
									key: item,
									label: MapKeyNameTinhTrangSuckhoe[item],
									value: item,
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSinhVienDotKham;
