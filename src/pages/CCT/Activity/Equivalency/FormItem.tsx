import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, FormInstance, Popconfirm } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const MAX_CHECK = 2;

const EquivalencyFormItem = (props: {
	coCurricularAttributesEquivalency: any[];
	form: FormInstance;
	disabled?: boolean;
}) => {
	const { coCurricularAttributesEquivalency, disabled, form } = props;
	const intl = useIntl();

	const { getAllModel, danhSach: dsAtribute } = useModel('danhmuc.attributes');
	const allowAttributeIds = coCurricularAttributesEquivalency?.map((i: any) => i.attributesId) || [];

	useEffect(() => {
		getAllModel(undefined, { order: 1 });
	}, []);

	useEffect(() => {
		form.resetFields(['coCurricularActivityEquivalency']);
	}, [JSON.stringify(coCurricularAttributesEquivalency)]);

	const baseAttributeIds = useMemo(
		() => coCurricularAttributesEquivalency?.map((i) => i.attributesId) || [],
		[coCurricularAttributesEquivalency],
	);

	const baseCount = baseAttributeIds.length;
	const availableSlot = Math.max(0, MAX_CHECK - baseCount);

	const highlightMap = useMemo(() => {
		const map: Record<string, string> = {};
		coCurricularAttributesEquivalency?.forEach((i) => {
			if (i.attributesId && i.attributes?.color) {
				map[i.attributesId] = i.attributes.color;
			}
		});
		return map;
	}, [coCurricularAttributesEquivalency]);

	const attributeColumns: IColumn<any>[] = useMemo(() => {
		if (!dsAtribute?.length) return [];

		return dsAtribute.map((attr) => {
			const isAllow = allowAttributeIds.includes(attr._id);
			const isBase = baseAttributeIds.includes(attr._id);
			const highlightColor = highlightMap[attr._id];

			return {
				title: (
					<div
						className='attribute-header'
						style={
							highlightColor
								? {
										background: `${highlightColor}11`,
										border: `1px solid ${highlightColor}`,
										color: highlightColor,
										borderRadius: 4,
										padding: '2px 4px',
										textAlign: 'center',
									}
								: { textAlign: 'center' }
						}
					>
						{attr.code}
					</div>
				),
				width: 60,
				align: 'center',
				render: (_: any, field: any) => (
					<Form.Item shouldUpdate noStyle>
						{({ getFieldValue }) => {
							const attributes = getFieldValue(['coCurricularActivityEquivalency', field.name, 'attributes']) || {};

							const userCheckedCount = Object.entries(attributes).filter(
								([id, v]) => v && !baseAttributeIds.includes(id),
							).length;

							const isChecked = attributes[attr._id];

							const disableCheckbox =
								disabled || (!isBase && !isChecked && userCheckedCount >= availableSlot) || (isBase && disabled);

							return (
								<Form.Item
									className='table-form-item'
									name={[field.name, 'attributes', attr._id]}
									valuePropName='checked'
								>
									<Checkbox disabled={disableCheckbox} />
								</Form.Item>
							);
						}}
					</Form.Item>
				),
			};
		});
	}, [dsAtribute, allowAttributeIds, baseAttributeIds, highlightMap, availableSlot, disabled]);

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
								const list = form.getFieldValue('coCurricularActivityEquivalency') || [];
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
						disabled={disabled}
						size='small'
						allowClear
						onChange={(val, option) => {
							const role = option?.rawData;

							form.setFieldValue(['coCurricularActivityEquivalency', field.name, 'role'], role);
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
						const role = getFieldValue(['coCurricularActivityEquivalency', field.name, 'role']);
						return <ExpandText>{role?.description ?? '--'}</ExpandText>;
					}}
				</Form.Item>
			),
		},
		...attributeColumns,
	];

	return (
		<Form.List name='coCurricularActivityEquivalency'>
			{(fields, { add, remove }) => (
				<TableStaticData
					columns={[
						...columns,
						{
							title: intl.formatMessage({ id: 'global.column.action' }),
							width: 90,
							fixed: 'right',
							align: 'center',
							render: (_, field) => (
								<Popconfirm
									title={intl.formatMessage({
										id: 'activity.equivalency.comfirm.xoa',
									})}
									onConfirm={() => remove(field.name)}
									disabled={disabled}
								>
									<ButtonExtend type='link' icon={<DeleteOutlined />} disabled={disabled} />
								</Popconfirm>
							),
						},
					]}
					data={fields}
					size='small'
					otherProps={{ pagination: false }}
					hasTotal
				>
					{!disabled && (
						<Button
							size='small'
							type='primary'
							onClick={() => {
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
						>
							{intl.formatMessage({ id: 'global.button.themmoi' })}
						</Button>
					)}
				</TableStaticData>
			)}
		</Form.List>
	);
};

export default EquivalencyFormItem;
