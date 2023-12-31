import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterKhoaSinhVien from '../KhoaSinhVien/components/FilterKhoaSinhVien';
import ModalChiTietKhoaSinhVien from '../KhoaSinhVien/components/ModalChiTiet';
import SelectKhoaSinhVien from '../KhoaSinhVien/components/Select';
import ModalLopHanhChinh from './components/ModalLopHanhChinh';
import ModalImport from '@/components/Table/Import';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EDoiTuongLopHanhChinh, doiTuongLopHanhChinh } from '@/services/DaoTaoV2/NamHoc/constant';

const LopHanhChinhPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, setFilters, filters } =
		useModel('daotaov2.namhoc.lophanhchinh');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const [visibleKhoaSv, setVisibleKhoaSv] = useState<boolean>(false);
	const [maKhoaSinhVien, setMaKhoaSinhVien] = useState<string>();
	const [visibleImportSvLhc, setVisibleImportSvLhc] = useState<boolean>(false);

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
			title: 'Mã lớp',
			dataIndex: 'ten',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Sĩ số',
			dataIndex: 'siSo',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			width: 120,
			dataIndex: 'maKhoaSinhVien',
			render: (val, rec) => (
				<a
					onClick={() => {
						setMaKhoaSinhVien(rec?.maKhoaSinhVien);
						setVisibleKhoaSv(true);
					}}
				>
					{rec?.khoaSinhVien?.ten}
				</a>
			),
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: 'Ngành đào tạo',
			width: 180,
			dataIndex: 'maNganh',
			render: (val, rec) => `${rec?.nganh?.dmNganh?.ten ?? ''} - ${rec?.nganh?.ma ?? ''}`,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			onCell,
		},
		{
			title: 'Đối tượng',
			width: 100,
			dataIndex: 'doiTuong',
			render: (val: EDoiTuongLopHanhChinh) => val && doiTuongLopHanhChinh[val],
			filterType: 'select',
			filterData: Object.values(EDoiTuongLopHanhChinh).map((item) => ({
				label: doiTuongLopHanhChinh[item],
				value: item,
			})),
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
							onConfirm={() => deleteModel(record._id)}
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
				modelName='daotaov2.namhoc.lophanhchinh'
				title={intl.formatMessage({ id: 'namhoc.lophanhchinh.title' })}
				Form={ModalLopHanhChinh}
				widthDrawer={800}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
				otherButtons={[
					<ButtonExtend key={'svlhc'} onClick={() => setVisibleImportSvLhc(true)} icon={<TeamOutlined />}>
						Nhập DS sinh viên
					</ButtonExtend>,
				]}
			>
				<div style={{ marginBottom: 12 }}>
					<FilterKhoaSinhVien allowClear />
				</div>
			</TableBase>

			{maKhoaSinhVien ? (
				<ModalChiTietKhoaSinhVien
					visible={visibleKhoaSv}
					setVisible={setVisibleKhoaSv}
					maKhoaSinhVien={maKhoaSinhVien}
					hasEdit={false}
				/>
			) : null}

			<ModalImport
				modelName='daotaov2.namhoc.sinhvienlophanhchinh'
				onCancel={() => setVisibleImportSvLhc(false)}
				visible={visibleImportSvLhc}
				onOk={() => {
					getModel();
					setVisibleImportSvLhc(false);
				}}
				titleTemplate='Biểu mẫu Sinh viên - Lớp hành chính.xlsx'
			/>
		</>
	);
};

export default LopHanhChinhPage;
