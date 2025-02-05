import { Button, Card, Col, Form, Input, Row } from 'antd';
import rules from '@/utils/rules';
import { useModel } from '@@/plugin-model/useModel';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { useEffect } from 'react';
import { resetFieldsForm } from '@/utils/utils';
import SelectMauDiemRenLuyen from '@/pages/DiemRenLuyen/BieuMau/components/Select';
import { ELoaiBieuMau } from '@/services/DiemRenLuyen/BieuMau/constants';

const FormThemMoi = () => {
	const { edit, setVisibleForm, formSubmiting, postModel, putModel, record, visibleForm } =
		useModel('diemrenluyen.dot');
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		try {
			const payload = {
				...values,
				thoiGianTiepNhanMinhChung: {
					thoiGianBatDau: values?.thoiGianTiepNhanMinhChung?.[0],
					thoiGianKetThuc: values?.thoiGianTiepNhanMinhChung?.[1],
				},
				thoiGianSVChamDiem: {
					thoiGianBatDau: values?.thoiGianSVChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianSVChamDiem?.[1],
				},
				thoiGianCoVanChamDiem: {
					thoiGianBatDau: values?.thoiGianCoVanChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianCoVanChamDiem?.[1],
				},
				thoiGianBCSChamDiem: {
					thoiGianBatDau: values?.thoiGianBCSChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianBCSChamDiem?.[1],
				},
				thoiGianPhongCTSVChamDiem: {
					thoiGianBatDau: values?.thoiGianPhongCTSVChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianPhongCTSVChamDiem?.[1],
				},
				thoiGianKhieuNai: {
					thoiGianBatDau: values?.thoiGianKhieuNai?.[0],
					thoiGianKetThuc: values?.thoiGianKhieuNai?.[1],
				},
			};
			if (edit) {
				putModel(record?._id ?? '', { ...payload });
			} else {
				postModel({ ...payload });
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				thoiGianTiepNhanMinhChung: [
					record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau,
					record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
				],
				thoiGianSVChamDiem: [record?.thoiGianSVChamDiem?.thoiGianBatDau, record?.thoiGianSVChamDiem?.thoiGianKetThuc],
				thoiGianCoVanChamDiem: [
					record?.thoiGianCoVanChamDiem?.thoiGianBatDau,
					record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
				],
				thoiGianBCSChamDiem: [
					record?.thoiGianBCSChamDiem?.thoiGianBatDau,
					record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
				],
				thoiGianPhongCTSVChamDiem: [
					record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau,
					record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
				],
				thoiGianKhieuNai: [record?.thoiGianKhieuNai?.thoiGianBatDau, record?.thoiGianKhieuNai?.thoiGianKetThuc],
			});
	}, [record?._id, visibleForm]);

	return (
		<>
			<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'đợt'}>
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item name='tenDot' label='Tên đợt' rules={[...rules.required, ...rules.text]}>
								<Input placeholder='Tên đợt' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='kyHoc' label='Kỳ học' rules={[...rules.required]}>
								<SelectHocKy selectMa />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='thoiGianTiepNhanMinhChung'
								label='Thời gian tiếp nhận minh chứng'
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='thoiGianSVChamDiem' label='Thời gian sinh viên chấm điểm' rules={[...rules.required]}>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='thoiGianBCSChamDiem' label='Thời gian ban cán sự chấm điểm' rules={[...rules.required]}>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='thoiGianCoVanChamDiem'
								label='Thời gian chủ nhiệm lớp xác nhận'
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='thoiGianKhieuNai' label='Thời gian gửi khiếu nại' rules={[...rules.required]}>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>

						{/*<Col span={12}>*/}
						{/*	<Form.Item*/}
						{/*		name='thoiGianPhongCTSVChamDiem'*/}
						{/*		label='Thời gian phòng CTSV chấm điểm'*/}
						{/*		rules={[...rules.required]}*/}
						{/*	>*/}
						{/*		<MyDateRangePicker*/}
						{/*			showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}*/}
						{/*			format={'HH:mm DD/MM/YYYY'}*/}
						{/*		/>*/}
						{/*	</Form.Item>*/}
						{/*</Col>*/}
						<Col span={24}>
							<Form.Item name='idBieuMau' label='Biểu mẫu' rules={[...rules.required]}>
								<SelectMauDiemRenLuyen loai={ELoaiBieuMau.CHAM_DIEM_REN_LUYEN} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
								<Input.TextArea placeholder={'Nhập ghi chú'} rows={3} />
							</Form.Item>
						</Col>
					</Row>

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
export default FormThemMoi;
