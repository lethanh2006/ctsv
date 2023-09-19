import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ModalChiTiet from './ModalChiTiet';

const LopHanhChinhPage = () => {
	const { page, limit, handleEdit, setVisibleForm, visibleForm } = useModel('daotao.lophanhchinh');

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
			onCell,
		},
		{
			title: 'Ngành đào tạo',
			width: 150,
			dataIndex: 'maNganh',
			render: (val, rec) => `${rec?.nganh?.ten ?? rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
			onCell,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotao.lophanhchinh'
				title='Lớp hành chính'
				buttons={{ create: false }}
			/>

			<ModalChiTiet visible={visibleForm} setVisible={setVisibleForm} />
		</>
	);
};

export default LopHanhChinhPage;
