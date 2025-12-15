import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectLopHanhChinh from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import { primaryColor } from '@/services/base/constant';
import { ETrangThaiKhieuNai, MapKeyColorTrangThaiKhieuNai } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { CheckOutlined, CloseOutlined, ExportOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';
import FormNhapPhieuDiem from '../PhieuDiem/FormPhieuDiem/Form';
import dayjs from 'dayjs';

const DonKhieuNaiPage = () => {
	const {
		getModel,
		exportDonKhieuNaiModel,
		loading,
		handleView,
		record: recPhieuDiem,
		xuLyKhieuNaiModel,
	} = useModel('diemrenluyen.phieudiemrenluyen');
	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');
	const { getByIdModel, record: recBieuMau } = useModel('diemrenluyen.bieumau');
	const [trangThai, setTrangThai] = useState<ETrangThaiKhieuNai | undefined>(ETrangThaiKhieuNai.CHO_XU_LY);
	const { record: recordLopHanhChinh, setRecord: setRecordLopHanhChinh } = useModel(
		'daotaov2.lophanhchinh.lophanhchinh',
	);
	const getData = () => {
		if (recDot?._id)
			getModel({
				dotChamDiemId: recDot?._id,
				guiKhieuNai: true,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
	};

	const onCell = (rec: PhieuDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(rec);
			setTrangThai(undefined);
		},
		style: { cursor: 'pointer' },
	});

	useEffect(() => {
		if (recDot?.idBieuMau) getByIdModel(recDot?.idBieuMau ?? '', true);
	}, [recDot?._id]);

	const columns: IColumn<PhieuDiemRenLuyen.IRecord>[] = [
		{
			title: 'Thời gian gửi khiếu nại',
			align: 'center',
			sortable: true,
			dataIndex: 'thoiGianGuiKhieuNai',
			width: 120,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Họ tên',
			align: 'center',
			dataIndex: 'hoTen',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mã sinh viên',
			align: 'center',
			dataIndex: 'maSinhVien',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Lớp',
			align: 'center',
			dataIndex: 'lopHanhChinh',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nội dung khiếu nại',
			// align: 'center',
			dataIndex: 'noiDungKhieuNai',
			width: 300,
			filterType: 'string',
			onCell,
		},
		{
			title: 'File minh chứng',
			dataIndex: 'urlFileDinhKem',
			align: 'center',
			onCell,
			width: 200,
			render: (val: string[]) => (
				<div>
					{val.map((item) => (
						<Tag key={item} color={primaryColor}>
							<a href={item} target='_blank' rel='noreferrer'>
								Xem tập tin
							</a>
						</Tag>
					))}
				</div>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiXuLyKhieuNai',
			width: 120,
			align: 'center',
			filterType: 'select',
			onCell,
			filterData: Object.values(ETrangThaiKhieuNai),
			render: (val: ETrangThaiKhieuNai) => <Tag color={MapKeyColorTrangThaiKhieuNai[val]}>{val}</Tag>,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Xuất đơn khiếu nại'>
						<Button
							loading={loading}
							onClick={() => {
								exportDonKhieuNaiModel(rec._id);
							}}
							type='link'
							icon={<ExportOutlined />}
						/>
					</Tooltip>
					{rec.trangThaiXuLyKhieuNai !== ETrangThaiKhieuNai.CHO_XU_LY && (
						<Tooltip title='Chuyển về chờ xử lý'>
							<Button
								loading={loading}
								onClick={() => {
									xuLyKhieuNaiModel(
										rec?._id ?? '',
										{
											traLoiNoiDungKhieuNai: '',
											trangThaiXuLyKhieuNai: ETrangThaiKhieuNai.CHO_XU_LY,
										},
										getData,
									);
								}}
								type='link'
								icon={<RedoOutlined />}
							/>
						</Tooltip>
					)}
					<Tooltip title='Duyệt đơn khiếu nại'>
						<Button
							disabled={rec.trangThaiXuLyKhieuNai !== ETrangThaiKhieuNai.CHO_XU_LY}
							loading={loading}
							onClick={() => {
								handleView(rec);
								setTrangThai(ETrangThaiKhieuNai.DA_DUYET);
							}}
							type='link'
							icon={<CheckOutlined />}
						/>
					</Tooltip>
					<Tooltip title='Không duyệt đơn khiếu nại'>
						<Button
							disabled={rec.trangThaiXuLyKhieuNai !== ETrangThaiKhieuNai.CHO_XU_LY}
							loading={loading}
							onClick={() => {
								handleView(rec);
								setTrangThai(ETrangThaiKhieuNai.KHONG_DUYET);
							}}
							type='link'
							icon={<CloseOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormNhapPhieuDiem isSuaDiemKhieuNai getData={getData} trangThai={trangThai} />,
		[recBieuMau?._id, recDot?._id, recPhieuDiem?._id, recordLopHanhChinh?._id, trangThai],
	);

	return (
		<TableBase
			maskCloseableForm
			widthDrawer={1000}
			dependencies={[recDot?._id, recordLopHanhChinh?._id]}
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
				<SelectLopHanhChinh
					key={'filterLop'}
					allowClear
					value={recordLopHanhChinh?._id}
					style={{ width: 300 }}
					onChange={(val: any, option: any) => {
						const rawData = option?.rawData;
						setRecordLopHanhChinh(rawData);
					}}
				/>,
			]}
			modelName={'diemrenluyen.phieudiemrenluyen'}
			columns={columns}
			title='Đơn khiếu nại'
		/>
	);
};

export default DonKhieuNaiPage;
