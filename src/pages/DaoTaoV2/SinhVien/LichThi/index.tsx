import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { ETrangThaiThi } from '@/services/DaoTaoV2/HocKy/constant';
import {
	colorDKDTCongNo,
	colorDKDTKetQuaHocTap,
	colorTrangThaiThi,
	EDKDTCongNo,
	EDKDTKetQuaHocTap,
} from '@/services/KhaoThi/LichThi/constant';
import { LichThi } from '@/services/KhaoThi/LichThi/typings';
import dayjs from '@/utils/dayjs';
import { EyeOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FilterHocKy from '../../HocKy/HocKy/components/FilterHocKy';

const LichThiSinhVien = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { getAllModel, danhSach, loading, setVisibleForm, visibleForm } = useModel('khaothi.lichthi');
	const [recLichThi, setRecLichThi] = useState<LichThi.IRecordSinhVien>();

	const getData = () => {
		if (recSinhVien?.ssoId && recHocKy?.ma) {
			getAllModel(undefined, undefined, undefined, undefined, `sv/${recSinhVien.ssoId}`, undefined, undefined, {
				maHocKy: recHocKy.ma,
			});
		}
	};
	useEffect(() => {
		getData();
	}, [recSinhVien?.ssoId, recHocKy?.ma]);

	const onCell = (rec: LichThi.IRecordSinhVien) => ({
		onClick: () => {
			setRecLichThi(rec);
			setVisibleForm(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LichThi.IRecordSinhVien>[] = [
		{
			title: 'Đợt thi',
			dataIndex: 'kyThi',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngày thi',
			dataIndex: 'ngayThi',
			align: 'center',
			width: 80,
			onCell,
		},
		{
			title: 'Giờ thi',
			dataIndex: 'gioThi',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: 'Mã học phần',
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Phòng thi',
			dataIndex: 'phong',
			width: 80,
			onCell,
		},
		{
			title: 'Số SV',
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			sortable: true,
			onCell,
		},
		{
			title: 'Điều kiện dự thi',
			width: 160,
			children: [
				{
					title: 'KQHT',
					dataIndex: 'dieuKienKetQuaHocTap',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTKetQuaHocTap),
					render: (val: EDKDTKetQuaHocTap) => val && <Tag color={colorDKDTKetQuaHocTap[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: 'Công nợ',
					dataIndex: 'dieuKienCongNo',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTCongNo),
					render: (val: EDKDTCongNo) => val && <Tag color={colorDKDTCongNo[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: 'Trạng thái thi',
					dataIndex: 'trangThai',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(ETrangThaiThi),
					render: (val: ETrangThaiThi) => val && <Tag color={colorTrangThaiThi[val as ETrangThaiThi]}>{val}</Tag>,
					onCell,
				},
			],
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			render: (rec) => <ButtonExtend tooltip='Chi tiết' type='link' icon={<EyeOutlined />} />,
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSach}
				addStt
				loading={loading}
				otherButtons={[<FilterHocKy isSetHocKy />]}
				onReload={getData}
			/>

			<Modal
				open={visibleForm}
				title='Chi tiết lịch thi'
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setVisibleForm(false)}
			>
				{recLichThi?.lichThiId && (
					<>
						<Descriptions column={1} size='small'>
							<Descriptions.Item label='Đợt thi'>{recLichThi?.kyThi}</Descriptions.Item>

							<Descriptions.Item label='Tên học phần'>{recLichThi?.tenHocPhan}</Descriptions.Item>

							<Descriptions.Item label='Mã học phần'>{recLichThi?.maHocPhan}</Descriptions.Item>

							<Descriptions.Item label='Số sinh viên'>{recLichThi?.soLuong}</Descriptions.Item>

							<Descriptions.Item label='Ngày thi'>
								{dayjs(recLichThi?.ngayGioThi).format('DD/MM/YYYY')}
							</Descriptions.Item>

							<Descriptions.Item label='Giờ thi'>
								{dayjs(recLichThi?.ngayGioThi).format('HH:mm')} – {dayjs(recLichThi?.ngayGioThiKetThuc).format('HH:mm')}
							</Descriptions.Item>

							<Descriptions.Item label='Thời lượng'>{recLichThi?.soPhut} phút</Descriptions.Item>

							<Descriptions.Item label='Phòng thi'>{recLichThi?.phong || '--'}</Descriptions.Item>
						</Descriptions>

						<Descriptions style={{ marginTop: 12 }} column={1} size='small' bordered>
							<Descriptions.Item label='Kết quả học tập'>
								{recLichThi?.dieuKienKetQuaHocTap && (
									<Tag color={colorDKDTKetQuaHocTap[recLichThi?.dieuKienKetQuaHocTap]}>
										{recLichThi?.dieuKienKetQuaHocTap}
									</Tag>
								)}
							</Descriptions.Item>

							<Descriptions.Item label='Công nợ'>
								{recLichThi?.dieuKienCongNo && (
									<Tag color={colorDKDTCongNo[recLichThi?.dieuKienCongNo]}>{recLichThi?.dieuKienCongNo}</Tag>
								)}
							</Descriptions.Item>

							<Descriptions.Item label='Trạng thái thi'>
								{recLichThi?.trangThai && (
									<Tag color={colorTrangThaiThi[recLichThi?.trangThai]}>{recLichThi.trangThai}</Tag>
								)}
							</Descriptions.Item>
						</Descriptions>
					</>
				)}
			</Modal>
		</>
	);
};

export default LichThiSinhVien;
