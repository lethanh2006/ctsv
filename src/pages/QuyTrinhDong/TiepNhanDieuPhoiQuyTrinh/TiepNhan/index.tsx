import TableTiepNhanDieuPhoi from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/TableTiepNhanDieuPhoi';
import ThongTinTongHop from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/ThongTinTongHop/ThongTinTongHop';

const TiepNhan = () => {
	return (
		<>
			<ThongTinTongHop type={'tiep_nhan'}>
				<TableTiepNhanDieuPhoi title={'Tiếp nhận'} type={'tiep_nhan'} />
			</ThongTinTongHop>
		</>
	);
};
export default TiepNhan;
