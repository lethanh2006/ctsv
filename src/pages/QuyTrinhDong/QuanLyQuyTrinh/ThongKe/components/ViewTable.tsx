import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

const ViewTableThongKe = (props: { data: any[] }) => {
	const columns: IColumn<any>[] =
		Object.keys(props?.data?.[0] ?? {})?.map((item) => ({
			title: item,
			dataIndex: item,
			width: 200,
			align: 'center',
			filterType: 'string',
		})) ?? [];

	return <TableStaticData addStt columns={columns} data={props?.data ?? []} />;
};

export default ViewTableThongKe;
