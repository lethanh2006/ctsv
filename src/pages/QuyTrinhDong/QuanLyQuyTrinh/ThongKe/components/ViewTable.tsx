import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

const ViewTableThongKe = (props: { data: any[] }) => {
	const columns: IColumn<any>[] = [];

	props?.data?.map((item) => {
		Object.keys(item)?.map((key) => {
			if (!columns.map((col) => col.dataIndex).includes(key)) {
				columns.push({
					title: key,
					dataIndex: key,
					width: 200,
					align: 'center',
					filterType: 'string',
				});
			}
		});
	});

	// Object.keys(props?.data?.[0] ?? {})?.map((item) => ({
	// 	title: item,
	// 	dataIndex: item,
	// 	width: 200,
	// 	align: 'center',
	// 	filterType: 'string',
	// })) ?? [];

	return <TableStaticData addStt columns={columns} data={props?.data ?? []} />;
};

export default ViewTableThongKe;
