import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useModel } from 'umi';

import FilterLopHanhChinh from '../../NamHoc/LopHanhChinh/components/FilterLopHanhChinh';
import SelectHocKy from '../HocKy/components/SelectHocKy';
import FormNhanSuHocKy from './Form';

const NhanSuHocKy = (props: { lopHanhChinh?: LopHanhChinh.IRecord }) => {
	const { danhSach: danhSachHocKy, setRecord: setRecHocKy, record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.hocky.nhansuhocky');
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');

	const getData = () => {
		getModel({ tenLopHc: props?.lopHanhChinh?.ten || recLopHanhChinh?.ten, maHocKy: recHocKy?.ma });
	};

	const columns: IColumn<LopHanhChinh.INhanSuHocKy>[] = [
		{
			title: 'Học kỳ',
			width: 100,
			dataIndex: 'maHocKy',
			render: (val, rec) => danhSachHocKy.find((item) => item.ma === val)?.ten,
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
			render: (record: LopHanhChinh.INhanSuHocKy) => (
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

	const Form = useCallback(
		() => <FormNhanSuHocKy lopHanhChinh={props?.lopHanhChinh} getData={getData} />,
		[recLopHanhChinh?._id, recHocKy?.ma, props?.lopHanhChinh?._id],
	);

	return (
		<>
			<TableBase
				hideCard={props.lopHanhChinh?._id ? true : false}
				columns={columns}
				buttons={{ import: true, export: true }}
				otherButtons={[
					<>{!props?.lopHanhChinh && <FilterLopHanhChinh key={'lop-hanh-chinh'} />}</>,
					<SelectHocKy
						allowClear
						selectMa
						value={recHocKy?.ma}
						onChange={(val) => setRecHocKy(danhSachHocKy.find((item) => item.ma === val))}
						style={{ width: 300 }}
						key={'namhoc'}
					/>,
				]}
				dependencies={[page, limit, recLopHanhChinh?._id, recHocKy?.ma, props?.lopHanhChinh?._id]}
				getData={getData}
				modelName='daotaov2.hocky.nhansuhocky'
				title={'Danh sách cố vấn học tập'}
				Form={Form}
				params={{ maHocKy: recHocKy?.ma }}
				// hideCard={hideCard}
			/>
		</>
	);
};

export default NhanSuHocKy;
