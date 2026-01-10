import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';
import TableCauHinh from './MauDon/TableCauHinh';
import { useEffect } from 'react';
import TableDanhMucDiemQuyDoi from '@/pages/DiemRenLuyen/MinhChung/CauHinh/components/TableDanhMucDiemQuyDoi';
import {
	EDoiTuongNhap,
	ELoaiMinhChung,
	MapEDoiTuongNhap,
	MapELoaiMinhChung,
} from '@/services/DiemRenLuyen/MinhChung/MauDon/constants';
import type { QuyTrinh } from '@/services/FormDong/QuyTrinh/typing';

const FormThemMoiBieuMau = () => {
	const [form] = Form.useForm();
	const { recordMauDon, setRecordMauDon } = useModel('formdong.formdong');
	const { edit, formSubmiting, setVisibleForm, setFormValues, formValues, postModel, putModel, record } = useModel(
		'diemrenluyen.minhchung.cauhinh',
	);
	const isDanhMucDiemQuyDoi = Form.useWatch('isDanhMucDiemQuyDoi', form);
	const dungChoSuKien = Form.useWatch('dungChoSuKien', form);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			danhSachCauHinhMinhChung: recordMauDon?.cauHinhLoaiHinh ?? [],
		};

		if (edit) {
			putModel(record?._id ?? '', { ...payload });
		} else {
			postModel({ ...payload });
		}
	};

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({
				...record,
				isDuyetMacDinh: record?.isDuyetMacDinh ?? false,
				choPhepNhieuMinhChung: record?.choPhepNhieuMinhChung ?? false,
			});
			setRecordMauDon({ cauHinhLoaiHinh: record?.danhSachCauHinhMinhChung ?? [] } as QuyTrinh.IMauDon);
		} else {
			form.setFieldsValue({
				isDanhMucDiemQuyDoi: false,
				dungChoSuKien: false,
				isDuyetMacDinh: false,
				choPhepNhieuMinhChung: false,
			});
			setRecordMauDon({} as QuyTrinh.IMauDon);
		}
	}, [edit, record]);

	return (
		<>
			<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'cấu hình minh chứng'}>
				<Form
					onValuesChange={(changedValues, values) => {
						setFormValues(values);
					}}
					onFinish={onFinish}
					form={form}
					layout='vertical'
				>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item name='tenMinhChung' label='Tên minh chứng' rules={[...rules.required, ...rules.text]}>
								<Input
									onChange={(e) => {
										if (!edit)
											form.setFieldsValue({ maMinhChung: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
									}}
									placeholder='Tên minh chứng'
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='maMinhChung' label='Mã minh chứng' rules={[...rules.required, ...rules.text]}>
								<Input placeholder='Mã minh chứng' disabled={edit} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='doiTuongNhap' label='Đối tượng nhập' rules={[...rules.required]}>
								<Select
									placeholder={'Chọn đối tượng'}
									mode={'multiple'}
									options={Object.values(EDoiTuongNhap)?.map((val) => ({
										value: val,
										label: MapEDoiTuongNhap?.[val as EDoiTuongNhap],
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='loaiMinhChung' label='Loại minh chứng' rules={[...rules.required]}>
								<Select
									placeholder={'Chọn loại minh chứng'}
									options={Object.values(ELoaiMinhChung)?.map((val) => ({
										value: val,
										label: MapELoaiMinhChung?.[val as ELoaiMinhChung],
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item name='dungChoSuKien' label='Dùng cho sự kiện'>
								<Select
									onChange={(val) => {
										if (val === true) {
											form.setFieldsValue({
												isDanhMucDiemQuyDoi: false,
											});
										}
									}}
									options={[
										{
											value: true,
											label: 'Dùng cho sự kiện',
										},
										{
											value: false,
											label: 'Không dùng cho sự kiện',
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='isDanhMucDiemQuyDoi' label='Là danh mục điểm quy đổi'>
								<Select
									disabled={dungChoSuKien}
									options={[
										{
											value: true,
											label: 'Là danh mục',
										},
										{
											value: false,
											label: 'Không là danh mục',
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='isDuyetMacDinh' label='Tự động duyệt minh chứng'>
								<Select
									options={[
										{
											value: true,
											label: 'Có',
										},
										{
											value: false,
											label: 'Không',
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='choPhepNhieuMinhChung' label='Cho phép nhiều minh chứng'>
								<Select
									options={[
										{
											value: true,
											label: 'Có',
										},
										{
											value: false,
											label: 'Không',
										},
									]}
								/>
							</Form.Item>
						</Col>
						{isDanhMucDiemQuyDoi && !dungChoSuKien && (
							<>
								<Col span={24}>
									<Form.Item
										name={'tenDanhMucQuyDoi'}
										label={'Tên danh mục quy đổi'}
										rules={[...rules.required, ...rules.text]}
									>
										<Input placeholder={'Tên danh mục quy đổi'} />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item name={'danhMucDiemQuyDoi'} label={'Danh mục điểm quy đổi'}>
										<TableDanhMucDiemQuyDoi formProps={form} />
									</Form.Item>
								</Col>
							</>
						)}
						{!isDanhMucDiemQuyDoi && (
							<Col span={12}>
								<Form.Item name='diemQuyDoi' label='Điểm quy đổi' rules={[...rules.required]}>
									<InputNumber style={{ width: '100%' }} placeholder='Điểm quy đổi' />
								</Form.Item>
							</Col>
						)}
						<Col span={24} md={12}>
							<Form.Item name='dungChoBanCanSuLop' valuePropName='checked'>
								<Checkbox>Dùng cho ban cán sự lớp</Checkbox>
							</Form.Item>
						</Col>
					</Row>

					<TableCauHinh form={form} formValues={formValues} />

					<div className='form-footer' style={{ marginTop: 16 }}>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				</Form>
			</Card>
		</>
	);
};

export default FormThemMoiBieuMau;
