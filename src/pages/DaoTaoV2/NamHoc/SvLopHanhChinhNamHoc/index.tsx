import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import type { LopHanhChinhSinhVienNamHoc } from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import FilterLopHanhChinh from '../LopHanhChinh/components/FilterLopHanhChinh';
import SelectNamHoc from '../NamHoc/components/Select';
import FormBanCanSuLop from './Form';
import { EVaiTroBanCanSuLop } from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/constants';
import {
	MapKeyColorVaiTroBanCanSuLop,
	MapKeyNameVaiTroBanCanSuLop,
} from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/constants';
import { EOperatorType } from '@/components/Table/constant';

const SinhVienLopHanhChinhNamHoc = () => {
	const { danhSach: danhSachNamHoc, setRecord: setRecNamHoc, record: recNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { getModel, page, limit, deleteModel, setFilters, filters, handleEdit } = useModel(
		'daotaov2.lophcsvnamhoc.lophcsvnamhoc',
	);
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { handleView: handleViewSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const onCell = (rec: LopHanhChinhSinhVienNamHoc.IRecord) => ({
		onClick: () => {
			setSinhVienSsoId(rec.lopHcSv.sinhVien?.ssoId);
			handleViewSinhVien();
		},
		style: { cursor: 'pointer' },
	});

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
		getModel({ maNamHoc: recNamHoc?.ma });
	};

	const columns: IColumn<LopHanhChinhSinhVienNamHoc.IRecord>[] = [
		{
			title: 'Năm học',
			width: 100,
			dataIndex: 'maNamHoc',
			render: (val, rec) => danhSachNamHoc.find((item) => item.ma === val)?.ten,
			align: 'center',
			onCell,
		},
		{
			title: 'Mã sinh viên',
			width: 100,
			render: (val, rec) => rec?.lopHcSv?.sinhVien?.ma,
			align: 'center',
			onCell,
		},
		{
			title: 'Họ tên',
			width: 150,
			align: 'center',
			render: (val, rec) => rec?.lopHcSv?.sinhVien?.ten,
			onCell,
		},
		{
			title: 'Lớp',
			width: 150,
			align: 'center',
			render: (val, rec) => rec?.lopHcSv?.lopHanhChinh?.ten,
			onCell,
		},
		{
			title: 'Vai trò',
			dataIndex: 'vaiTro',
			width: 200,
			align: 'center',
			render: (val: EVaiTroBanCanSuLop) => (
				<Tag color={MapKeyColorVaiTroBanCanSuLop[val]}>{MapKeyNameVaiTroBanCanSuLop[val]}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(EVaiTroBanCanSuLop).map((item) => ({
				value: item,
				label: MapKeyNameVaiTroBanCanSuLop[item],
			})),
			onCell,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (record: LopHanhChinhSinhVienNamHoc.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa vai trò sinh viên?'
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
				modelName='daotaov2.lophcsvnamhoc.lophcsvnamhoc'
				title={'Danh sách ban cán sự lớp'}
				Form={Form}
				// hideCard={hideCard}
			/>
			<ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} />
		</>
	);
};

export default SinhVienLopHanhChinhNamHoc;
