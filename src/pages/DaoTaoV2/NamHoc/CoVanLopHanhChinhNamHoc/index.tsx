import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useModel } from 'umi';
import FilterLopHanhChinh from '../LopHanhChinh/components/FilterLopHanhChinh';
import SelectNamHoc from '../NamHoc/components/Select';
import FormBanCanSuLop from './Form';

const SinhVienLopHanhChinhNamHoc = () => {
	const { danhSach: danhSachNamHoc, setRecord: setRecNamHoc, record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.lophcnsnamhoc.lophcnsnamhoc');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');

	// useEffect(() => {
	// 	setFilters([
	// 		...filters,
	// 		{
	// 			path: ['lopHcSv', 'lopHanhChinh', '_id'],
	// 			operator: EOperatorType.EQUAL,
	// 			values: [recLopHanhChinh?._id ?? ''],
	// 		},
	// 	]);
	// }, [recLopHanhChinh?._id]);

	const getData = () => {
		getModel({ tenLopHc: recLopHanhChinh?.ten, maNamHoc: recNamHoc?.ma });
	};

	const columns: IColumn<LopHanhChinhNhanSuNamHoc.IRecord>[] = [
		{
			title: 'Năm học',
			width: 100,
			dataIndex: 'maNamHoc',
			render: (val, rec) => danhSachNamHoc.find((item) => item.ma === val)?.ten,
			align: 'center',
		},
		{
			title: 'Mã cán bộ',
			width: 100,
			dataIndex: 'maNhanSu',
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Họ tên',
			width: 150,
			align: 'center',
			dataIndex: 'hoTenNhanSu',
			filterType: 'string',
		},
		{
			title: 'Lớp',
			width: 150,
			align: 'center',
			dataIndex: 'tenLopHc',
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinhNhanSuNamHoc.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa vai trò cố vấn học tập?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(() => <FormBanCanSuLop getData={getData} />, [recLopHanhChinh?._id, recNamHoc?.ma]);

	return (
		<>
			<TableBase
				columns={columns}
				buttons={{ import: true }}
				otherButtons={[
					<FilterLopHanhChinh key={'lop-hanh-chinh'} />,
					<SelectNamHoc
						allowClear
						selectMa
						value={recNamHoc?.ma}
						onChange={(val) => setRecNamHoc(danhSachNamHoc.find((item) => item.ma === val))}
						style={{ width: 200 }}
						key={'namhoc'}
					/>,
				]}
				dependencies={[page, limit, recLopHanhChinh?._id, recNamHoc?.ma]}
				getData={getData}
				modelName='daotaov2.lophcnsnamhoc.lophcnsnamhoc'
				title={'Danh sách cố vấn học tập'}
				Form={Form}
				// hideCard={hideCard}
			/>
		</>
	);
};

export default SinhVienLopHanhChinhNamHoc;
