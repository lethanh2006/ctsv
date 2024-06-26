import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

const ViewTableThongKe = (props: { data: any[] }) => {
	let columns: IColumn<any>[] = [];

	props?.data?.map((item) => {
		const arrKeyObject = Object.keys(item);
		arrKeyObject?.map((key, index) => {
			if (key.includes(' - ')) {
				const arrKey = key.split(' - ');
				const existColumn = columns.find((col: any) => col?.title?.includes(arrKey[0]));
				if (!existColumn) {
					columns.push({
						title: arrKey[0],
						width: 200,
						align: 'center',
						filterType: 'string',
						children: [
							{
								title: arrKey[1],
								dataIndex: arrKey.length > 2 ? undefined : key,
								width: 200,
								align: 'center',
								children:
									arrKey.length > 2
										? [
												{
													title: arrKey[2],
													dataIndex: key,
													width: 200,
													align: 'center',
												},
										  ]
										: undefined,
							},
						],
					});
				} else {
					const existChildren = existColumn?.children?.find((child: any) => child?.title?.includes(arrKey[1]));
					debugger;
					columns = [
						...columns.filter((col) => col.title !== arrKey[0]),
						{
							title: arrKey[0],
							width: 200,
							align: 'center',
							filterType: 'string',
							children: !existChildren
								? [
										...(existColumn?.children ?? []),
										{
											title: arrKey[1],
											dataIndex: arrKey.length === 3 ? undefined : key,
											width: 200,
											align: 'center',
											children:
												arrKey.length === 3
													? [
															{
																title: arrKey[2],
																dataIndex: key,
																width: 200,
																align: 'center',
															},
													  ]
													: undefined,
										},
								  ]
								: existColumn?.children?.map((children) => {
										const existChild = children?.children?.find((child: any) => child?.title?.includes(arrKey[2]));
										debugger;
										if (arrKey.length === 3) {
											return {
												title: arrKey[1],
												width: 200,
												align: 'center',
												children: !existChild
													? [
															...(children?.children ?? []),
															{
																title: arrKey[2],
																dataIndex: key,
																width: 200,
																align: 'center',
															},
													  ]
													: children?.children ?? [],
											};
										} else return children;
								  }),
						},
					];
				}
			} else if (!columns.map((col) => col.title).includes(key)) {
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

	console.log(columns);

	return <TableStaticData addStt columns={columns} data={props?.data ?? []} />;
	// return <div />;
};

export default ViewTableThongKe;
