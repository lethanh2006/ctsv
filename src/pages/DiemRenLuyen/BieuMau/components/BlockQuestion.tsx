import { ELoaiBieuMau, ELoaiCauHoi, ELoaiCauHoiDrl, ELoaiCauHoiMappingToLabel } from '@/services/KhaoSat/constant';
import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GridChoice from './QuestionType/GridChoice';
import NumericRange from './QuestionType/NumericChoice';
import SingleChoice from './QuestionType/SingleChoice';
import { type BaseOptionType } from 'antd/lib/select';
import { type FormInstance } from 'antd/es/form/Form';
import SelectMinhChung from '@/pages/DiemRenLuyen/MinhChung/CauHinh/Select';

const BlockQuestion = (props: { form: FormInstance<any>; index: number; block: number }) => {
	const { record } = useModel('khaosat.bieumau');
	const [questionType, setQuestionType] = useState<string>(
		record?.danhSachKhoi?.[props.block]?.danhSachCauHoi?.[props.index]?.loai ??
			record?.loai === ELoaiBieuMau.DANH_GIA_CAN_BO
			? ELoaiCauHoi.NumberInputRating
			: ELoaiCauHoi.NumberInputRating,
	);

	useEffect(() => {
		if (record?.danhSachKhoi?.[props.block]?.danhSachCauHoi?.[props.index]?.loai) {
			setQuestionType(record?.danhSachKhoi?.[props.block]?.danhSachCauHoi?.[props.index]?.loai);
		}
	}, [record?.danhSachKhoi]);

	const renderContent = () => {
		if (
			questionType === 'NumericRange' ||
			questionType === ELoaiCauHoi.NumberInputRating ||
			questionType === ELoaiCauHoi.HE_THONG
		) {
			return <NumericRange blockIndex={props.block} form={props.form} index={props.index} />;
		} else {
			if (questionType === ELoaiCauHoi.MINH_CHUNG) {
				return (
					<Form.Item name={[props.index, 'cauHinhMinhChungId']} label='Minh chứng' rules={[...rules.required]}>
						<SelectMinhChung />
					</Form.Item>
				);
			}
		}
		return;
	};

	return (
		<>
			<Row gutter={[12, 0]}>
				<Col md={12} lg={16}>
					<Form.Item name={[props.index, 'noiDungCauHoi']} label='Nội dung câu hỏi' rules={[...rules.required]}>
						<Input placeholder='Nội dung câu hỏi' />
					</Form.Item>
				</Col>
				<Col md={12} lg={8}>
					<Form.Item name={[props.index, 'loai']} label='Loại' rules={[...rules.required]} initialValue={questionType}>
						<Select
							onChange={(val: string) => setQuestionType(val)}
							placeholder='Chọn loại câu hỏi'
							options={Object.values(ELoaiCauHoiDrl).reduce<BaseOptionType[]>((result, value) => {
								if (record?.loai === ELoaiBieuMau.DANH_GIA_CAN_BO) {
									if (value === ELoaiCauHoi.NumberInputRating) {
										return result.concat({
											key: value,
											value,
											label: ELoaiCauHoiMappingToLabel[value],
										});
									}
									return result;
								}
								return result.concat({
									key: value,
									value,
									label: ELoaiCauHoiMappingToLabel[value],
								});
							}, [])}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item valuePropName='checked' name={[props.index, 'batBuoc']}>
				<Checkbox>Bắt buộc</Checkbox>
			</Form.Item>
			{questionType === ELoaiCauHoi.MINH_CHUNG && (
				<Form.Item valuePropName='checked' name={[props.index, 'choPhepVuotKhung']}>
					<Checkbox>Cho phép vượt khung</Checkbox>
				</Form.Item>
			)}

			{['SingleChoice', 'MultipleChoice'].includes(questionType) && (
				<Form.List
					name={[props.index, 'luaChon']}
					rules={[
						{
							validator: async (_, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(new Error('Ít nhất 1 đáp án'));
								}
								return '';
							},
						},
					]}
				>
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<SingleChoice index={index} remove={remove} fieldName={field.name} key={field.key} />
							))}
							<Form.ErrorList errors={errors} />
							<Button onClick={() => add()} icon={<PlusOutlined />} size='small' type='primary'>
								Thêm đáp án
							</Button>
						</>
					)}
				</Form.List>
			)}

			{/* {questionType === 'SingleChoice' && (
        <Form.Item valuePropName="checked" name={[props.index, 'cauTraLoiKhac']}>
          <Checkbox>Câu trả lời khác</Checkbox>
        </Form.Item>
      )} */}

			{['GridSingleChoice', 'GridMultipleChoice'].includes(questionType) && <GridChoice name={props.index} />}
			{(questionType === 'NumericRange' ||
				questionType === ELoaiCauHoi.NumberInputRating ||
				questionType === ELoaiCauHoi.HE_THONG) && (
				<NumericRange blockIndex={props.block} form={props.form} index={props.index} />
			)}
			{questionType === ELoaiCauHoi.MINH_CHUNG && (
				<>
					<Form.Item name={[props.index, 'diemMacDinh']} label='Điểm mặc định'>
						<InputNumber style={{ width: '100%' }} placeholder={'Nhập điểm mặc định'} />
					</Form.Item>
					<Form.Item name={[props.index, 'cauHinhMinhChungId']} label='Minh chứng' rules={[...rules.required]}>
						<SelectMinhChung multiple />
					</Form.Item>
					<NumericRange blockIndex={props.block} form={props.form} index={props.index} />
				</>
			)}
		</>
	);
};

export default BlockQuestion;
