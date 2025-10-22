import TableStaticData from '@/components/Table/TableStaticData';
import { Button, Modal, Tabs } from 'antd';
import { useModel } from 'umi';

const KetQuaCapNhatAnhSV = () => {
	const { visibleKetQuaImportAnh, setVisibleKetQuaImportAnh } = useModel('daotaov2.sinhvien.sinhvien');

	const model: any = useModel('daotaov2.sinhvien.sinhvien');
	const MapKeyName: any = {
		listImageSuccess: 'Thành công',
		listImageError: 'Gặp lỗi',
		listImageNotfound: 'Không tìm thấy sinh viên',
	};
	return (
		<Modal
			destroyOnHidden
			styles={{ paddingTop: 4 }}
			width={700}
			title='Kết quả cập nhật ảnh sinh viên'
			open={visibleKetQuaImportAnh}
			footer={
				<Button type='primary' onClick={() => setVisibleKetQuaImportAnh(false)}>
					Đóng
				</Button>
			}
		>
			<Tabs>
				{['listImageSuccess', 'listImageError', 'listImageNotfound'].map((item) => (
					<Tabs.TabPane key={item} tabKey={item} tab={`${MapKeyName[item]} (${model?.[item]?.length ?? 0})`}>
						<TableStaticData
							addStt
							columns={[
								{
									title: 'Tên ảnh',
									dataIndex: 'filename',
									width: 200,
									align: 'center',
								},
								{
									title: 'Lý do',
									dataIndex: 'reason',
									width: 200,
									hide: item !== 'listImageError',
								},
							]}
							data={model?.[item] ?? []}
						/>
					</Tabs.TabPane>
				))}
			</Tabs>
		</Modal>
	);
};

export default KetQuaCapNhatAnhSV;
