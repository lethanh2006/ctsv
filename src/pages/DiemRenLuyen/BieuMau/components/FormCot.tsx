import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Popover, Radio, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormGiaTriLienQuan from './FormGiaTriLienQuan';
import _ from 'lodash';
import { removeVietnameseTones } from '@/utils/utils';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { v4 } from 'uuid';

const FormCot = (props: { onCancel: any; edit: boolean; setEdit: any }) => {
	const [form] = Form.useForm();
	const { formSubmiting, recordCauHinh, setRecordCauHinh, recordCot } = useModel('diemrenluyen.bieumau');
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.Cot | undefined>(
		recordCauHinh?.danhSachCot?.find((item) => item.ma === recordCot?.truongThongTinLienQuan),
	);
	const { edit } = props;
	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCot?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		if (recordCot?.ma && edit) form.setFieldsValue(recordCot);
	}, [recordCot?.ma]);

	const onFinish = async (values: LoaiHinh.Cot, isContinue: boolean) => {
		if (!recordCauHinh) return;

		const listMaCot = edit
			? recordCauHinh.danhSachCot.filter((item) => item.ma !== recordCot?.ma)
			: recordCauHinh.danhSachCot;

		if (listMaCot?.map((item) => item.ma)?.includes(values?.ma)) {
			message.error('Mã đã tồn tại');
			return;
		}

		const payload = {
			...recordCot,
			...values,
			ma: edit && recordCot ? recordCot.ma : v4(),
		};

		if (edit && recordCauHinh && recordCot) {
			const index = recordCauHinh.danhSachCot.map((item: { ma: string }) => item.ma).indexOf(recordCot.ma);
			const danhSachCot = [...recordCauHinh.danhSachCot];
			danhSachCot.splice(index, 1, payload);
			setRecordCauHinh({ ...recordCauHinh, danhSachCot });
		} else {
			setRecordCauHinh({
				...(recordCauHinh || {}),
				danhSachCot: [...(recordCauHinh?.danhSachCot ?? []), payload],
			} as LoaiHinh.TruongThongTin);
		}
		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		if (isContinue) {
			form.resetFields();
			props.setEdit(false);
		} else props.onCancel();
	};

	const isAvailableDangMang = [EKieuDuLieu.DANHMUC, EKieuDuLieu.DECIMAL, EKieuDuLieu.NUMBER, EKieuDuLieu.TEXT].includes(
		kieuDuLieu,
	);

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'cột'}>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{/* <Col xs={24} sm={24} md={12}>
						<Form.Item name='ma' label='Mã cột' rules={[...rules.required, ...rules.text]}>
							<Input disabled placeholder='Mã cột' />
						</Form.Item>
					</Col> */}
					<Col xs={24} sm={24} md={12}>
						<Form.Item name='ten' label='Tên cột' rules={[...rules.required, ...rules.text]}>
							<Input
								autoFocus
								onChange={(e) =>
									form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) })
								}
								placeholder='Tên cột'
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='kieuDuLieu' label='Kiểu dữ liệu' rules={[...rules.required]}>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu)
							.filter((item) => item !== EKieuDuLieu.TABLE)
							.map((item) => ({ label: item, value: item }))}
						placeholder='Kiểu dữ liệu'
					/>
				</Form.Item>
				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								Danh mục (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false);
									}}
									style={{ padding: 0 }}
									type='link'
								>
									Làm mới
								</Button>
								)
							</span>
						}
						rules={[...rules.required]}
					>
						<Select
							options={danhSach.map((item) => ({
								label: (
									<Popover
										placement='left'
										content={
											<div>
												{item.danhSachGiaTri.map((giaTri: string) => (
													<div key={giaTri}>- {giaTri}</div>
												))}
											</div>
										}
									>
										{item.maDanhMuc}
									</Popover>
								),
								value: item.maDanhMuc,
							}))}
							placeholder='Danh mục'
						/>
					</Form.Item>
				)}

				<Form.Item name='truongThongTinLienQuan' label='Trường thông tin liên quan'>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(recordCauHinh?.danhSachCot?.find((item) => item.ma === val));
						}}
						options={recordCauHinh?.danhSachCot
							?.filter((item) => item.ma !== recordCot?.ma)
							?.map((item) => ({ label: item.ten, value: item.ma }))}
						placeholder='Trường thông tin liên quan'
					/>
				</Form.Item>
				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item name='layDuLieuTu' label='Lấy dữ liệu từ trường thông tin'>
					<Select
						allowClear
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder='Lấy dữ liệu từ trường thông tin'
					/>
				</Form.Item>

				<Form.Item name='truongLayDuLieu' label='Trường lấy dữ liệu' rules={[...rules.text]}>
					<Input placeholder='Trường lấy dữ liệu' />
				</Form.Item>

				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='batBuoc' label='Bắt buộc' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: 'Có' },
									{ value: false, label: 'Không' },
								]}
							/>
						</Form.Item>
					</Col>
					{isAvailableDangMang && (
						<Col span={8}>
							<Form.Item name='laDangMang' label='Cho phép nhập nhiều giá trị' rules={[...rules.required]}>
								<Radio.Group
									options={[
										{ value: true, label: 'Có' },
										{ value: false, label: 'Không' },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label='Chiều rộng'>
							<InputNumber style={{ width: '100%' }} min={0} max={24} placeholder='Nhập giá trị' />
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

export default FormCot;
