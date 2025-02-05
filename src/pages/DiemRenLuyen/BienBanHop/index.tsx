import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	ETrangThaiDuyetBienBanHopDiemRenLuyen,
	MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen,
} from '@/services/DiemRenLuyen/BienBanHop/constant';
import type { BienBanHopDiemRenLuyen } from '@/services/DiemRenLuyen/BienBanHop/typings';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Tag, Tooltip } from 'antd';
import { useCallback } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import ViewDetailBienBanHopDrl from './ViewDetail';

const BienBanHopPage = () => {
	const { getModel, handleEdit, deleteModel, record: recBienBanHop } = useModel('diemrenluyen.bienbanhop');
	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');
	const getData = () => {
		if (recDot?._id) getModel({ dotChamDiemId: recDot?._id });
	};

	const onCell = (rec: BienBanHopDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleEdit(rec);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<BienBanHopDiemRenLuyen.IRecord>[] = [
		{
			title: 'Lớp',
			align: 'center',
			dataIndex: 'tenLopHC',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Chủ trì',
			dataIndex: ['chuTri', 'ten'],
			width: 200,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thư ký',
			dataIndex: ['thuKy', 'ten'],
			width: 200,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDuyet',
			width: 200,
			align: 'center',
			filterType: 'select',
			onCell,
			filterData: Object.values(ETrangThaiDuyetBienBanHopDiemRenLuyen),
			render: (val: ETrangThaiDuyetBienBanHopDiemRenLuyen) => (
				<Tag color={MapKeyColorTrangThaiDuyetBienBanHopDiemRenLuyen[val]}>{val}</Tag>
			),
		},
		{
			title: 'Thao tác',
			width: 200,
			align: 'center',
			render: (val, rec) => (
				<>
					<Tooltip title='Xem chi tiêt'>
						<Button
							onClick={() => {
								handleEdit(rec);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
					{/* {[
						ETrangThaiDuyetBienBanHopDiemRenLuyen.CHO_DUYET,
						ETrangThaiDuyetBienBanHopDiemRenLuyen.YEU_CAU_CHINH_SUA,
					].includes(rec.trangThaiDuyet) && (
						<>
							<Tooltip title='Xác nhận'>
								<Button
									onClick={() => {
										putModel(
											rec._id,
											{ ...rec, trangThaiDuyet: ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET },
											getData,
										);
									}}
									type='link'
									icon={<CheckOutlined />}
								/>
							</Tooltip>
							<Tooltip title='Yêu cầu chỉnh sửa'>
								<Button onClick={() => {

								}} type='link' icon={<EditOutlined />} />
							</Tooltip>
						</>
					)} */}
					<Tooltip title='Xóa biên bản'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, getData)}
							title={'Bạn có chắc chắn xóa biên bản họp này?'}
						>
							<Button type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(
		() => (
			<Card title={`Biên bản họp lớp ${recBienBanHop?.tenLopHC}`}>
				<ViewDetailBienBanHopDrl getData={getData} />
			</Card>
		),
		[recBienBanHop?.tenLopHC],
	);

	return (
		<TableBase
			maskCloseableForm
			widthDrawer={1000}
			dependencies={[recDot?._id]}
			getData={getData}
			buttons={{ create: false }}
			Form={Form}
			otherButtons={[
				<SelectDotDiemRenLuyen
					key={'filterDot'}
					style={{ width: 300 }}
					value={recDot?._id}
					onChange={(val, option) => {
						const rawData = option?.rawData;
						setRecDot(rawData);
					}}
					isSetRecord={true}
				/>,
			]}
			modelName={'diemrenluyen.bienbanhop'}
			columns={columns}
			title='Biên bản họp'
		/>
	);
};

export default BienBanHopPage;
