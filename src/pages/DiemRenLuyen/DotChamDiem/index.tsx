import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DotChamDiem } from '@/services/DiemRenLuyen/DotChamDiem/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import { FormDotChamDiem } from './components/Form';

// FIXME: Thiếu filter theo kỳ
export default () => {
	const { page, limit, handleView, handleEdit, deleteModel, getModel } = useModel('diemrenluyen.dotchamdiem');

	const onCell = (rec: DotChamDiem.IRecord) => ({
		onClick: () => {
			handleView(rec);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<DotChamDiem.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			filterType: 'string',
			width: 170,
			onCell,
		},
		// {
		// 	filterType: 'customselect',
		// 	filterCustomSelect: (
		// 		<SelectHocKy value={condition?.kyHoc} onChange={(val) => setCondition({ kyHoc: val })} style={{ width: 250 }} />
		// 	),
		// 	width: 120,
		// 	dataIndex: 'kyHoc',
		// },
		{
			title: 'Thời gian tiếp nhận minh chứng',
			render: (_, rec) =>
				`${
					rec.thoiGianTiepNhanMinhChung?.thoiGianBatDau
						? moment(rec.thoiGianTiepNhanMinhChung.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianTiepNhanMinhChung?.thoiGianKetThuc
						? moment(rec.thoiGianTiepNhanMinhChung.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			align: 'center',
			onCell,
		},
		{
			title: 'Thời gian SV tự chấm điểm',
			render: (_, rec) =>
				`${
					rec.thoiGianSVChamDiem?.thoiGianBatDau
						? moment(rec.thoiGianSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianSVChamDiem?.thoiGianKetThuc
						? moment(rec.thoiGianSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			align: 'center',
			onCell,
		},
		{
			title: 'Thời gian CVHT chấm điểm',
			render: (_, rec) =>
				`${
					rec.thoiGianCVHTChamDiem?.thoiGianBatDau
						? moment(rec.thoiGianCVHTChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: ''
				} - ${
					rec.thoiGianCVHTChamDiem?.thoiGianKetThuc
						? moment(rec.thoiGianCVHTChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: ''
				}`,
			width: 150,
			align: 'center',
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			render: (val) => (
				<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}>
					{val}
				</ExpandText>
			),
			width: 220,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							placement='topRight'
							onConfirm={() => deleteModel(val._id, getModel)}
							title='Bạn có chắc chắn muốn xóa đợt chấm điểm này?'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			widthDrawer={900}
			dependencies={[page, limit]}
			title='Đợt chấm điểm'
			columns={columns}
			modelName='diemrenluyen.dotchamdiem'
			Form={FormDotChamDiem}
		/>
	);
};
