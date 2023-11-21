import { EOperatorType } from '@/components/Table/constant';
import { ETinhTrangSucKhoe, colorETinhTrangSucKhoe } from '@/services/DotKhamSuKhoe/constant';

import { Card, Col, Row } from 'antd';
import { useModel } from 'umi';

const StatKetQuaKhamSucKhoe = () => {
	// const { isThoiHoc } = props;
	const { setFilters, filters } = useModel('khaibaosuckhoe.suckhoesinhvien');
	// const { thongkeSinhVienCanhBaoModel, thongKe } = useModel('ketquahoctap.xethocvu.thongke');
	// const { record: recHocKy } = useModel('hocky.hocky');

	// const tongSVCanhBao = (thongKe?.choDuyet ?? 0) + (thongKe?.khongDuyet ?? 0) + (thongKe?.daDuyet ?? 0);

	// useEffect(() => {
	// 	if (recHocKy?.ma) thongkeSinhVienCanhBaoModel(isThoiHoc ? 'thoi-hoc' : 'canh-bao-ket-qua-hoc-tap', recHocKy?.ma);
	// }, [recHocKy?.ma, isThoiHoc]);

	const handleTrangThai = (tinhTrangSucKhoe?: ETinhTrangSucKhoe) => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'tinhTrangSucKhoe');
		if (tinhTrangSucKhoe)
			temp.push({
				active: true,
				field: 'tinhTrangSucKhoe',
				operator: EOperatorType.INCLUDE,
				values: [tinhTrangSucKhoe],
			});
		setFilters(temp);
	};

	return (
		<>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Card className='card-stat-small' onClick={() => handleTrangThai()} style={{ cursor: 'pointer' }}>
						<span className='num'>
							{/* {'--'} */}
							--
						</span>
						<span>Tổng số SV</span>
					</Card>
				</Col>

				{Object.values(ETinhTrangSucKhoe).map((item) => (
					<Col span={12} md={6} key={item}>
						<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={() => handleTrangThai(item)}>
							<span className='num' style={{ color: colorETinhTrangSucKhoe[item] }}>
								{/* {thongKe?.[fieldTrangThaiDuyetCanhBao[item]] ?? '--'} */}
								--
							</span>
							<span>SV {item.toLocaleLowerCase()}</span>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default StatKetQuaKhamSucKhoe;
