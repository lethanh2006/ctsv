import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import { useEffect, useState } from 'react';
import { getDanhSachChuaKhaiBao, getDanhSachChuaKhaiBaoPage } from '@/services/DaoTaoV2/DotCapNhatHoSo';
import { Button } from 'antd';

const DanhSachChuaKhaiBao = (props: { data?: DotCapNhatHoSo.IRecord; onCancel?: () => void }) => {
	const [danhSachChuaKhaiBao, setDanhSachChuaKhaiBao] = useState<DotCapNhatHoSo.IThongTinSinhVien[]>([]);
	const [page, setPage] = useState<number>(0);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const handleGetDanhSach = async (id: string) => {
		try {
			setLoading(true);
			const res = await getDanhSachChuaKhaiBao(id);
			if (res) {
				setDanhSachChuaKhaiBao(res?.data?.data ?? []);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	const columns: IColumn<DotCapNhatHoSo.IThongTinSinhVien>[] = [
		{
			title: 'Tên sinh viên',
			dataIndex: 'ten',
			filterType: 'string',
			width: 150,
		},
		{
			title: 'CMT/CCCD',
			dataIndex: 'cccd',
			filterType: 'string',
			width: 150,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			filterType: 'string',
			width: 120,
		},
		{
			title: 'Lớp hành chính',
			dataIndex: 'lopHanhChinh',
			filterType: 'string',
			width: 120,
			render: (value) => {
				return value
			},
		},
	];

	useEffect(() => {
		if (props?.data?._id) handleGetDanhSach(props?.data?._id);
	}, [props?.data, page, limit]);
	console.log('dđ', danhSachChuaKhaiBao);
	return (
		<>
			<TableStaticData
				loading={loading}
				otherProps={{ size: 'small' }}
				addStt
				size={'small'}
				data={danhSachChuaKhaiBao?.map((val)=>({...val,lopHanhChinh:val?.lopHanhChinhList?.[0]?.ten}))}
				columns={columns}
				setShowEdit={(val) => {}}
			/>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
				<Button
					onClick={() => {
						if (props?.onCancel) props?.onCancel();
					}}
				>
					Đóng
				</Button>
			</div>
		</>
	);
};
export default DanhSachChuaKhaiBao;
