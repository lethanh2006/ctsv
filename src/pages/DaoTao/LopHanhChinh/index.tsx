import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectKhoaSinhVien from '../KhoaSinhVien/Select';
import SelectNganhCoSo from '../Nganh/Select';
import ModalLopHanhChinh from './ModalLopHanhChinh';

const LopHanhChinhPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit, setFilters, filters } = useModel('daotao.lophanhchinh');
	const { record: recKhoa } = useModel('daotao.khoasinhvien');

	useEffect(() => {
		if (recKhoa?.ma)
			setFilters([
				...(filters ?? []).filter((item) => item.field !== 'maKhoaSinhVien'),
				{ active: true, field: 'maKhoaSinhVien', values: [recKhoa?.ma], operator: EOperatorType.INCLUDE },
			]);
		else if (filters) setFilters([...filters].filter((item) => item.field !== 'maKhoaSinhVien'));
	}, [recKhoa?.ma]);

	const onCell = (record: LopHanhChinh.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHanhChinh.IRecord>[] = [
		{
			title: 'Tên lớp hành chính',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Sĩ số',
			dataIndex: 'siSo',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			width: 150,
			dataIndex: 'maKhoaSinhVien',
			render: (val, rec) => rec?.khoaSinhVien?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien selectMa multiple />,
			onCell,
		},
		{
			title: 'Ngành đào tạo',
			width: 150,
			dataIndex: 'maNganh',
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LopHanhChinh.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa lớp hành chính này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotao.lophanhchinh'
				title='Lớp hành chính'
				Form={ModalLopHanhChinh}
				widthDrawer={800}
				// buttons={{ import: true }}
			/>
		</>
	);
};

export default LopHanhChinhPage;
