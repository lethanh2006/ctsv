import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { useState } from 'react';
import { Button, Form, FormInstance, Input, InputNumber, message, Modal, Popconfirm } from 'antd';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Iprop {
	value?: any;
	formProps: FormInstance;
}

const TableDanhMucDiemQuyDoi = (props: Iprop) => {
	const { value, formProps } = props;
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<any>();
	const [edit, setEdit] = useState<boolean>(false);

	const columns: IColumn<any>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'tieuDe',
			width: 150,
		},
		{
			title: 'Điểm quy đổi',
			dataIndex: 'diemQuyDoi',
			align: 'center',
			width: 150,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						type='link'
						icon={<EditOutlined />}
						onClick={() => {
							setRecord(rec);
							setEdit(true);
							setVisibleForm(true);
						}}
					/>
					<Popconfirm
						title={'Bạn có chắc chắn muốn xoá danh mục này?'}
						onConfirm={() => {
							const dataOrigin = formProps.getFieldValue('danhMucDiemQuyDoi') ?? [];
							formProps.setFieldsValue({
								danhMucDiemQuyDoi: dataOrigin?.filter((item: any) => item?.tieuDe !== rec?.tieuDe),
							});
						}}
					>
						<ButtonExtend tooltip='Xoá' type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				otherProps={{ size: 'small',pagination:false }}
				size={'small'}
				hasCreate
				addStt
				setShowEdit={(val) => {
					setVisibleForm(val);
					setRecord(undefined);
					setEdit(false);
				}}
				data={value}
				columns={columns}
			/>

			<Modal
				title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} danh mục điểm quy đổi`}
				footer={null}
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				destroyOnClose
			>
				<Form
					layout={'vertical'}
					onFinish={(values) => {
						const dataOrigin = formProps.getFieldValue('danhMucDiemQuyDoi') ?? [];

						if (dataOrigin?.find((item: any) => item?.tieuDe === values?.tieuDe) && !edit) {
							message.warn('Không được trùng tiêu đề');
							return;
						}

						if (edit) {
							dataOrigin?.forEach((item: any, index: number) => {
								if (item?.tieuDe === values?.tieuDe) {
									dataOrigin?.splice(index, index, { ...values });
								}
							});
						} else {
							dataOrigin?.push({ ...values });
						}

						formProps.setFieldsValue({ danhMucDiemQuyDoi: dataOrigin });
						setVisibleForm(false);
					}}
					initialValues={record}
				>
					<Form.Item name={'tieuDe'} label={'Nội dung'}>
						<Input disabled={edit} placeholder={'Nội dung'} />
					</Form.Item>
					<Form.Item name={'diemQuyDoi'} label={'Điểm quy đổi'}>
						<InputNumber placeholder={'Nhập điểm quy đổi'} style={{ width: '100%' }} />
					</Form.Item>

					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
							Lưu
						</Button>
						<Button
							onClick={() => {
								setVisibleForm(false);
							}}
						>
							Đóng
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};
export default TableDanhMucDiemQuyDoi;
