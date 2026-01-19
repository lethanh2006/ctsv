import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, message, Popconfirm } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const normalizeEquivalencyData = (data: any[]) => {
	const map: Record<string, any> = {};

	data.forEach((item) => {
		const roleId = item.rolesId;
		if (!roleId) return;

		if (!map[roleId]) {
			map[roleId] = {
				rolesId: roleId,
				role: item.roles ?? null,
				attributes: {},
			};
		}

		if (item.attributesId) {
			map[roleId].attributes[item.attributesId] = true;
		}
	});

	return Object.values(map);
};

const EquivalencyPage = () => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record: recActi, setVisibleForm, isView, getByIdModel } = useModel('cct.activity');
	const { getModel, danhSach, loading, formSubmiting, postManyEquivalencyModel } = useModel('cct.equivalency');
	const { getAllModel, danhSach: dsAtribute } = useModel('danhmuc.attributes');
	const allowAttributeIds = recActi?.coCurricularAttributesEquivalency?.map((i: any) => i.attributesId) || [];

	useEffect(() => {
		getAllModel(undefined, { order: 1 });
	}, []);

	const getData = () => {
		if (recActi?._id) {
			getModel({ activitiesId: recActi._id });
		}
	};

	useEffect(() => {
		getData();
		if (recActi?._id) {
			getByIdModel(recActi?._id);
		}
	}, [recActi?._id]);

	useEffect(() => {
		if (danhSach?.length) {
			form.setFieldsValue({
				listCoCurricularActivityEquivalency: normalizeEquivalencyData(danhSach),
			});
		}
	}, [JSON.stringify(danhSach)]);

	const attributeColumns: IColumn<any>[] = useMemo(() => {
		if (!dsAtribute?.length) return [];

		return dsAtribute.map((attr: any) => {
			const isAllow = allowAttributeIds.includes(attr._id);

			return {
				title: attr.code,
				width: 60,
				align: 'center',
				render: (_: any, field: any) => (
					<Form.Item className='table-form-item' name={[field.name, 'attributes', attr._id]} valuePropName='checked'>
						<Checkbox disabled={isView || !isAllow} />
					</Form.Item>
				),
			};
		});
	}, [dsAtribute]);

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'activity.equivalency.role' }),
			width: 240,
			fixed: 'left',
			render: (_, field) => (
				<Form.Item
					className='table-form-item'
					name={[field.name, 'rolesId']}
					rules={[
						...rules.required,
						() => ({
							validator(_, value) {
								if (!value) return Promise.resolve();
								const list = form.getFieldValue('listCoCurricularActivityEquivalency') || [];
								const duplicated = list.some((item: any, idx: number) => idx !== field.name && item?.rolesId === value);
								if (duplicated) {
									return Promise.reject(
										new Error(
											intl.formatMessage({
												id: 'activity.equivalency.role.vali',
											}),
										),
									);
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<SelectRolesManagement
						disabled={isView}
						size='small'
						allowClear
						onChange={(val, option) => {
							const role = option?.rawData;

							form.setFieldValue(['listCoCurricularActivityEquivalency', field.name, 'role'], role);
						}}
					/>
				</Form.Item>
			),
		},
		{
			title: intl.formatMessage({ id: 'activity.equivalency.description' }),
			width: 280,
			render: (_, field) => (
				<Form.Item shouldUpdate noStyle>
					{({ getFieldValue }) => {
						const role = getFieldValue(['listCoCurricularActivityEquivalency', field.name, 'role']);
						return <ExpandText>{role?.description ?? '--'}</ExpandText>;
					}}
				</Form.Item>
			),
		},
		...attributeColumns,
	];

	const onFinish = (values: { listCoCurricularActivityEquivalency: Activity.IEquivalency[] }) => {
		const list = values.listCoCurricularActivityEquivalency || [];

		const roleIds = list.map((i) => i.rolesId).filter(Boolean);
		if (roleIds.some((id, idx) => roleIds.indexOf(id) !== idx)) {
			message.error(intl.formatMessage({ id: 'activity.equivalency.vali' }));
			return;
		}

		const result: any[] = [];

		list.forEach((item: any) => {
			const { rolesId, attributes = {} } = item;

			const selectedAttributeIds = Object.keys(attributes).filter((id) => attributes[id]);

			if (!selectedAttributeIds.length) {
				result.push({
					activitiesId: recActi?._id,
					rolesId,
					attributesId: null,
				});
				return;
			}

			selectedAttributeIds.forEach((attrId) => {
				result.push({
					activitiesId: recActi?._id,
					rolesId,
					attributesId: attrId,
				});
			});
		});

		postManyEquivalencyModel(
			recActi?._id ?? '',
			{ listCoCurricularActivityEquivalency: result },
			getData,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		)
			.then(() => setVisibleForm(false))
			.catch(() => {});
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<div style={{ marginBottom: 8 }}>
				<Alert showIcon type='warning' description={'Note'} />
			</div>

			<Form.List name='listCoCurricularActivityEquivalency'>
				{(fields, { add, remove }) => (
					<TableStaticData
						columns={[
							...columns,
							{
								title: intl.formatMessage({ id: 'global.column.action' }),
								width: 60,
								fixed: 'right',
								align: 'center',
								render: (_, field) => (
									<Popconfirm
										title={intl.formatMessage({
											id: 'activity.equivalency.comfirm.xoa',
										})}
										onConfirm={() => remove(field.name)}
										disabled={isView}
									>
										<ButtonExtend type='link' icon={<DeleteOutlined />} disabled={isView} />
									</Popconfirm>
								),
							},
						]}
						data={fields}
						loading={loading}
						size='small'
						otherProps={{ pagination: false }}
						otherButtons={[
							<ButtonExtend
								key='add'
								size='small'
								type='primary'
								icon={<PlusCircleOutlined />}
								onClick={() => {
									// const defaultAttributes = recActi?.activitiesType?.attributesId
									// 	? { [recActi?.activitiesType?.attributesId]: true }
									// 	: {};

									const defaultAttributes = (dsAtribute || []).reduce((acc: any, attr: any) => {
										if (allowAttributeIds.includes(attr._id)) {
											acc[attr._id] = true;
										}
										return acc;
									}, {});

									add({
										role: null,
										attributes: defaultAttributes,
									});
								}}
								disabled={isView}
							>
								{intl.formatMessage({ id: 'global.button.themmoi' })}
							</ButtonExtend>,
							recActi?._id ? (
								<ButtonExtend key='reload' size='small' icon={<ReloadOutlined />} onClick={getData}>
									{intl.formatMessage({ id: 'global.button.tailai' })}
								</ButtonExtend>
							) : (
								<></>
							),
						]}
					/>
				)}
			</Form.List>

			<div className='form-footer'>
				{!isView && (
					<Button loading={formSubmiting} type='primary' htmlType='submit'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Form>
	);
};

export default EquivalencyPage;
