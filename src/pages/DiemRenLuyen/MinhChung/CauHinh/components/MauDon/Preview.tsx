import { Card, Col, Form, Row, Select } from 'antd';
import { useModel } from 'umi';
import FormRender from './FormRender';
import { useEffect, useState } from 'react';
// import TableThanhVien from './TableThanhVien';
import { resetFieldsForm } from '@/utils/utils';
import dayjs from 'dayjs';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import rules from '@/utils/rules';

const PreviewForm = (props: { isView?: boolean; getData: any; mode: 'quytrinh' | 'loaihinh' }) => {
	const [form] = Form.useForm();
	const { record: recordLoaiHinh } = useModel('formdong.loaihinh');
	const { record } = useModel('diemrenluyen.minhchung.cauhinh');
	const { recordQuyTrinhForm, visibleForm, edit } = useModel('quytrinh.quanlyquytrinh');

	const [formValues, setFormValues] = useState<any>({
		...recordQuyTrinhForm,
		...recordQuyTrinhForm?.thongTinKhaiBao,
		vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
		thoiGian: [dayjs(recordQuyTrinhForm?.thongTinThoiGian?.start), dayjs(recordQuyTrinhForm?.thongTinThoiGian?.end)],
	});

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordQuyTrinhForm?._id)
			form.setFieldsValue({
				...recordQuyTrinhForm,
				...recordQuyTrinhForm?.thongTinKhaiBao,
				vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
				thoiGian: [
					dayjs(recordQuyTrinhForm?.thongTinThoiGian?.start),
					dayjs(recordQuyTrinhForm?.thongTinThoiGian?.end),
				],
			});
	}, [recordQuyTrinhForm?._id, visibleForm]);

	const handleFinish = async () => {
		for (const item in formValues) {
			const value = formValues[item];
			if (value?.fileList?.length) {
				formValues[item] = await buildUpLoadMultiFile(formValues, item);
			}
		}
	};

	return (
		<Card
			title={props.mode === 'loaihinh' ? `${!edit ? 'Thêm mới' : 'Chỉnh sửa'} ${record?.ten}` : record?.tenMinhChung}
		>
			<Form
				labelCol={{ span: 24 }}
				form={form}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={async (values) => {
					if (!record) return;
					const isTrung = false;
					if (record.searchKey1) {
						// isTrung = await searchSanPhamModel(values?.[record.searchKey1], recordQuyTrinhForm?._id ?? '');
					}
					if (isTrung) return;
					handleFinish();
				}}
			>
				<Row gutter={[12, 0]}>
					{record?.isDanhMucDiemQuyDoi && (
						<Col span={24}>
							<Form.Item name={'diemQuyDoi'} label={record?.tenDanhMucQuyDoi ?? 'Hạng mục'} rules={[...rules.required]}>
								<Select
									placeholder={record?.tenDanhMucQuyDoi ?? 'Chọn hạng mục'}
									options={record?.danhMucDiemQuyDoi?.map((val) => ({
										value: val?.diemQuyDoi,
										label: `${val?.tieuDe}`,
									}))}
								/>
							</Form.Item>
						</Col>
					)}
					{recordLoaiHinh?.cauHinhLoaiHinh?.map((item: LoaiHinh.TruongThongTin | LoaiHinh.Cot) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>
			</Form>
		</Card>
	);
};

export default PreviewForm;
