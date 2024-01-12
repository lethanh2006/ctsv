import type { MauDiemRenLuyen } from '@/services/DiemRenLuyen/BieuMau/typings';
import { ELoaiGiaTriMacDinh, MapKeyNameLoaiGiaTriMacDinh } from '@/services/DiemRenLuyen/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Select, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableCauHinh from './TableCauHinh';
import { v4 } from 'uuid';

const FormTieuChi = (props: { onCancel: any; edit: boolean; setEdit: any }) => {
	const [form] = Form.useForm();
	const { record, setRecordTieuChi, formSubmiting, setRecord, recordTieuChi } = useModel('diemrenluyen.bieumau');
	const { edit } = props;
	const yeuCauMinhChung = Form.useWatch('yeuCauMinhChung', form);
	useEffect(() => {
		form.setFieldsValue(recordTieuChi?.ma && props.edit ? recordTieuChi : form);
	}, [recordTieuChi?.ma]);

	const onFinish = async (values: MauDiemRenLuyen.TieuChiDanhGia, isContinue: boolean) => {
		if (!record) return;

		const listTieuChi = edit
			? record.danhSachTieuChiDanhGia.filter((item) => item.ma !== recordTieuChi?.ma)
			: record.danhSachTieuChiDanhGia;

		if (listTieuChi?.map((item) => item.ma)?.includes(values?.ma)) {
			message.error('Mã đã tồn tại');
			return;
		}
		const payload = {
			...recordTieuChi,
			...values,
			ma: edit && recordTieuChi ? recordTieuChi.ma : v4(),
		};
		if (edit && recordTieuChi) {
			const index = record.danhSachTieuChiDanhGia.map((item) => item.ma).indexOf(recordTieuChi.ma);
			const danhSachTieuChiDanhGia = [...record.danhSachTieuChiDanhGia];
			danhSachTieuChiDanhGia.splice(index, 1, payload);
			setRecord({ ...record, danhSachTieuChiDanhGia });
		} else {
			setRecord({
				...record,
				danhSachTieuChiDanhGia: [...(record?.danhSachTieuChiDanhGia ?? []), payload],
			});
		}
		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		if (isContinue) {
			form.resetFields();
			form.setFieldsValue(form);
			setRecordTieuChi({ ...recordTieuChi, danhSachCauHinhMinhChung: [] } as MauDiemRenLuyen.TieuChiDanhGia);
			props.setEdit(false);
		} else props.onCancel();
	};

	const canDuoi = Form.useWatch('canDuoi', form) || 0;
	const canTren = Form.useWatch('canTren', form) || 0;
	const coGiaTriMacDinh = Form.useWatch('coGiaTriMacDinh', form);
	const loaiGiaTriMacDinh = Form.useWatch('loaiGiaTriMacDinh', form);

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'tiêu chí'}>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='ten' label='Tiêu chí' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea autoFocus placeholder='Tiêu chí' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='canDuoi' label='Thang điểm từ' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} min={0} max={1000} placeholder='Thang điểm từ' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='canTren' label='đến' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} min={canDuoi + 1} placeholder='đến' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='yeuCauMinhChung' label='Yêu cầu khai báo minh chứng' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: 'Có' },
									{ value: false, label: 'Không' },
								]}
							/>
						</Form.Item>
					</Col>
					{yeuCauMinhChung && (
						<Col span={24}>
							<TableCauHinh />
						</Col>
					)}
					<Col span={12}>
						<Form.Item name='coGiaTriMacDinh' label='Sử dụng giá trị mặc định' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: 'Có' },
									{ value: false, label: 'Không' },
								]}
							/>
						</Form.Item>
					</Col>
					{coGiaTriMacDinh && (
						<Col span={12}>
							<Form.Item rules={[...rules.required]} name='loaiGiaTriMacDinh' label='Loại giá trị mặc định'>
								<Select
									allowClear
									options={Object.values(ELoaiGiaTriMacDinh)?.map((item) => ({
										label: MapKeyNameLoaiGiaTriMacDinh[item],
										value: item,
									}))}
									placeholder='Loại giá trị mặc định'
								/>
							</Form.Item>
						</Col>
					)}
					{coGiaTriMacDinh && loaiGiaTriMacDinh === ELoaiGiaTriMacDinh.NHAP_SAN && (
						<Col span={12}>
							<Form.Item name='giaTriMacDinhNhapSan' label='Giá trị mặc định' rules={[...rules.required]}>
								<InputNumber style={{ width: '100%' }} min={canDuoi} max={canTren} placeholder='Giá trị mặc định' />
							</Form.Item>
						</Col>
					)}
					{coGiaTriMacDinh && loaiGiaTriMacDinh === ELoaiGiaTriMacDinh.HAM_TUY_BIEN && (
						<Col span={12}>
							<Form.Item name='tenHamTuyBien' label='Tên hàm tùy biến' rules={[...rules.required, ...rules.text]}>
								<Input autoFocus placeholder='Tên hàm tùy biến' />
							</Form.Item>
						</Col>
					)}

					<Col span={12}>
						<Form.Item name='readonly' label='Readonly' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: 'Có' },
									{ value: false, label: 'Không' },
								]}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					{!edit && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							Thêm mới và tiếp tục
						</Button>
					)}
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormTieuChi;
