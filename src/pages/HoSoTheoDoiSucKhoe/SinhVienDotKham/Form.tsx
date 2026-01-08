import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { EPhanLoaiSucKhoe, ETinhTrangSucKhoe, MapKeyNameTinhTrangSuckhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSinhVienDotKham = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'hosotheodoisuckhoe.suckhoesinhvien',
	);
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { title } = props;
	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const getData = () => getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotKhamSucKhoe.ISucKhoeSinhVien) => {
		const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === values?.sinhVienSsoId);
		const data = {
			...record,
			...values,
			dotKhamSucKhoeId: recDotKhaiBao?._id ?? '',
			hoTen: recSinhVien?.ten,
			maSinhVien: recSinhVien?.ma,
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
		<Card
			title={`${intl.formatMessage({ id: edit ? 'global.title.chinhsua' : 'global.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{/* <Col xs={24}>
						<Form.Item label='Đợt khám sức khỏe'>
							<Input value={recDotKhaiBao?.ten} disabled />
						</Form.Item>
					</Col> */}
					<Col xs={24}>
						<Form.Item
							name='sinhVienSsoId'
							label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.sinhvien' })}
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce disabled={edit} />
						</Form.Item>
					</Col>

					<Col xs={12}>
						<Form.Item
							rules={[...rules.required, ...rules.text]}
							label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.maxetnghiem' })}
							name='maXetNghiem'
						>
							<Input placeholder={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.maxetnghiem' })} />
						</Form.Item>
					</Col>
					<Col xs={12}>
						<Form.Item
							rules={[...rules.required]}
							label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.phanloaisuckhoe' })}
							name='phanLoaiSucKhoe'
						>
							<Select
								options={Object.values(EPhanLoaiSucKhoe).map((item) => ({ value: item, label: item }))}
								placeholder={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.phanloaisuckhoe' })}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.benhtat' })} name='benhTat'>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.benhtat' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.tuvan' })} name='tuVan'>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.tuvan' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.ghichu' })} name='ghiChu'>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.ghichu' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='tinhTrangSucKhoe'
							label={intl.formatMessage({ id: 'sinhvien.dotkham.form.label.ketluan' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'sinhvien.dotkham.form.placeholder.ketluan' })}
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
						{intl.formatMessage({ id: edit ? 'global.button.luulai' : 'sinhvien.dotkham.form.button.themmoi' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSinhVienDotKham;
