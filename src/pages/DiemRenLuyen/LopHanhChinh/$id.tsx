import { CarryOutOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { history, useModel } from 'umi';
import ViewDetailBienBanHopDrl from '../BienBanHop/ViewDetail';
import DanhSachKhaiBao from '../MinhChung/DanhSachKhaiBao';
import PhieuDiemRenLuyen from '../PhieuDiem';
import PhieuTongHop from '../PhieuTongHop';

const DetailLopHanhChinh = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { setRecord: setRecLopHanhChinh, record, getByIdModel } = useModel('daotaov2.lophanhchinh.lophanhchinh');
	const { setDanhSach: setDanhSachMinhChung, setTotal: setTotalMinhChung } = useModel('diemrenluyen.minhchung.khaibao');
	const { setDanhSach: setDanhSachPhieuDiem, setTotal: setTotalPhieuDiem } = useModel('diemrenluyen.phieudiemrenluyen');
	const paths = ['minh-chung', 'phieu-diem', 'bien-ban-hop', 'phieu-tong-hop'];
	const auth = useAuth();
	const [tabActive, setTabActive] = useState<string>(paths[0]);
	const hash = window.location.hash?.replace('#', '') ?? paths[0];

	useEffect(() => {
		if (id && auth.user?.access_token)
			getByIdModel(id).catch((er) => {
				history.push('/diem-ren-luyen/lop-hanh-chinh');
			});
	}, [auth.user?.access_token, id]);

	useEffect(() => {
		if (hash && paths.includes(hash)) setTabActive(hash);
		else setTabActive(paths[0]);
	}, [hash]);

	useEffect(() => {
		return () => {
			setRecLopHanhChinh(undefined);
			setDanhSachMinhChung([]);
			setDanhSachPhieuDiem([]);
			setTotalMinhChung(0);
			setTotalPhieuDiem(0);
			// setRecBienBanHop(undefined);
			// setRecPhieuTongHop(undefined);
		};
	}, []);

	const onChangeTab = (tab: string) => {
		window.location.hash = tab === paths[0] ? '' : tab;
	};

	return (
		<Card
			styles={{ paddingTop: 4 }}
			title={
				<Breadcrumb style={{ cursor: 'pointer' }}>
					<Breadcrumb.Item onClick={() => history.push('/diem-ren-luyen/lop-hanh-chinh')}>
						<CarryOutOutlined /> Lớp hành chính
					</Breadcrumb.Item>
					<Breadcrumb.Item>{record?.ten ?? ''}</Breadcrumb.Item>
				</Breadcrumb>
			}
		>
			<Tabs onChange={onChangeTab} activeKey={tabActive}>
				<Tabs.TabPane tab='Minh chứng' key={paths[0]} />
				<Tabs.TabPane tab='Phiếu điểm' key={paths[1]} />
				<Tabs.TabPane tab='Biên bản họp' key={paths[2]} />
				<Tabs.TabPane tab='Phiếu tổng hợp' key={paths[3]} />
			</Tabs>

			{tabActive === paths[0] ? (
				<DanhSachKhaiBao idLop={id} />
			) : tabActive === paths[1] ? (
				<PhieuDiemRenLuyen idLop={id} />
			) : tabActive === paths[2] ? (
				<ViewDetailBienBanHopDrl tenLop={record?.ten} idLop={id} />
			) : tabActive === paths[3] ? (
				<PhieuTongHop tenLop={record?.ten} idLop={id} />
			) : null}
		</Card>
	);
};

export default DetailLopHanhChinh;
