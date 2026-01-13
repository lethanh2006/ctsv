import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import FormStudentDomain from './Form';

const FormItemStudentDomain = (props: {
	value?: ActivitiesTypeDomain.IStudentDeclaration[];
	onChange?: (data: ActivitiesTypeDomain.IStudentDeclaration[]) => void;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { setVisibleForm, visibleForm, setEdit, edit, record, setRecord, setIsView } =
		useModel('danhmuc.studentdomain');
	const { value = [], onChange, disabled } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: ActivitiesTypeDomain.IStudentDeclaration) => {
		if (!record?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<ActivitiesTypeDomain.IStudentDeclaration>[] = [
		{
			title: intl.formatMessage({ id: 'activitiestypedomain.student.column.hoten' }),
			dataIndex: 'name',
			width: 220,
		},
		{
			title: intl.formatMessage({ id: 'activitiestypedomain.student.column.email' }),
			dataIndex: 'email',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title={intl.formatMessage({ id: 'activitiestypedomain.student.comfirm.xoa' })}
						placement='topLeft'
						disabled={disabled}
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
							disabled={disabled}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData data={value} columns={columns} size='small' hasTotal addStt>
				{!disabled && (
					<Button
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setRecord({} as ActivitiesTypeDomain.IStudentDeclaration);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						size='small'
						type='primary'
					>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
				)}
			</TableStaticData>

			<Modal
				title={
					edit
						? intl.formatMessage({ id: 'activitiestypedomain.student.form.chinhsua' })
						: intl.formatMessage({ id: 'activitiestypedomain.student.form.themmoi' })
				}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormStudentDomain onOk={onAdd} />
			</Modal>
		</>
	);
};

export default FormItemStudentDomain;
