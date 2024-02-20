import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Select, message } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormGiaTriLienQuan from './FormGiaTriLienQuan';
import SelectDanhMuc from './SelectDanhMuc';
import TableCot from './TableCot';
import { v4 } from 'uuid';

const FormCauHinh = (props: { onCancel: any; edit: boolean; setEdit: any }) => {
	const [form] = Form.useForm();
	const { setRecordCauHinh, formSubmiting, setRecordTieuChi, recordCauHinh, recordTieuChi } =
		useModel('diemrenluyen.bieumau');

	const { edit } = props;

	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCauHinh?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.TruongThongTin | undefined>(
		recordTieuChi?.danhSachCauHinhMinhChung?.find((item) => item.ma === recordCauHinh?.truongThongTinLienQuan),
	);

	const { loading: loadingDanhMucChung, getAllModel: getAllDanhMucChung } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		form.setFieldsValue(recordCauHinh?.ma && edit ? recordCauHinh : form);
	}, [recordCauHinh?.ma]);

	const onFinish = async (values: LoaiHinh.TruongThongTin, isContinue: boolean) => {
		if (!recordTieuChi) return;

		const listMaCauHinh = edit
			? recordTieuChi.danhSachCauHinhMinhChung.filter((item) => item.ma !== recordCauHinh?.ma)
			: recordTieuChi.danhSachCauHinhMinhChung;

		if (listMaCauHinh?.map((item) => item.ma)?.includes(values?.ma)) {
			message.error('Mã đã tồn tại');
			return;
		}

		const payload = {
			...recordCauHinh,
			...values,
			ma: edit && recordCauHinh ? recordCauHinh.ma : v4(),
		};

		if (edit && recordCauHinh) {
			const index = recordTieuChi.danhSachCauHinhMinhChung.map((item) => item.ma).indexOf(recordCauHinh.ma);
			const danhSachCauHinhMinhChung = [...recordTieuChi.danhSachCauHinhMinhChung];
			danhSachCauHinhMinhChung.splice(index, 1, payload);
			setRecordTieuChi({ ...recordTieuChi, danhSachCauHinhMinhChung });
		} else {
			setRecordTieuChi({
				...recordTieuChi,
				danhSachCauHinhMinhChung: [...(recordTieuChi?.danhSachCauHinhMinhChung ?? []), payload],
			});
		}
		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		if (isContinue) {
			form.resetFields();
			form.setFieldsValue(form);
			setRecordCauHinh({ ...recordCauHinh, danhSachCot: [] } as LoaiHinh.TruongThongTin);
			props.setEdit(false);
		} else props.onCancel();
	};

	const isAvailableDangMang = [
		EKieuDuLieu.DANHMUC,
		EKieuDuLieu.DECIMAL,
		EKieuDuLieu.NUMBER,
		EKieuDuLieu.TEXT,
		EKieuDuLieu.FILE,
	].includes(kieuDuLieu);

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'cấu hình'}>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				{/* <Form.Item name='ma' label='Mã' rules={[...rules.required, ...rules.text]}>
					<Input placeholder='Mã' />
				</Form.Item> */}
				<Form.Item name='ten' label='Tên' rules={[...rules.required, ...rules.text]}>
					<Input
						onChange={(e) => form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) })}
						autoFocus
						placeholder='Tên'
					/>
				</Form.Item>
				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
					<Input.TextArea placeholder='Ghi chú' />
				</Form.Item>

				<Form.Item name='kieuDuLieu' label='Kiểu dữ liệu' rules={[...rules.required]}>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu).map((item) => ({ label: item, value: item }))}
						placeholder='Kiểu dữ liệu'
					/>
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
						<Col span={isAvailableDangMang ? 8 : 12}>
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
					{kieuDuLieu === EKieuDuLieu.TEXT && (
						<Col span={12}>
							<Form.Item name='textarea' label='Text area' rules={[...rules.required]}>
								<Radio.Group
									options={[
										{ value: true, label: 'Có' },
										{ value: false, label: 'Không' },
									]}
								/>
							</Form.Item>
						</Col>
					)}
				</Row>

				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								Danh mục (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
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
						<SelectDanhMuc hasCreate maModule={ELoaiDanhMucChung.CHE_DO_CHINH_SACH} />
					</Form.Item>
				)}

				{kieuDuLieu === EKieuDuLieu.TABLE && (
					<>
						<TableCot />
						<Form.Item
							extra={'Để trống nếu muốn hiển thị tất cả các cột'}
							style={{ marginTop: 8 }}
							name='danhSachCotHienThi'
							label='Danh sách cột hiển thị'
							// rules={[...rules.required]}
						>
							<Select
								allowClear
								options={recordCauHinh?.danhSachCot?.map((item) => ({ label: item.ten, value: item.ma }))}
								mode='multiple'
								placeholder='Danh sách cột hiển thị'
							/>
						</Form.Item>
					</>
				)}

				<Form.Item name='truongThongTinLienQuan' label='Trường thông tin liên quan'>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(recordTieuChi?.danhSachCauHinhMinhChung?.find((item) => item.ma === val));
						}}
						options={recordTieuChi?.danhSachCauHinhMinhChung
							?.filter((item) => item.ma !== recordCauHinh?.ma)
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
						options={recordTieuChi?.danhSachCauHinhMinhChung
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder='Lấy dữ liệu từ trường thông tin'
					/>
				</Form.Item>

				<Form.Item name='truongLayDuLieu' label='Trường lấy dữ liệu' rules={[...rules.text]}>
					<Input placeholder='Trường lấy dữ liệu' />
				</Form.Item>

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

export default FormCauHinh;
