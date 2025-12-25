import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import SelectRolesManagement from '@/pages/DanhMuc/Roles/components/Select';
import SelectMauKhaoSat from '@/pages/TienIch/KhaoSat/components/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import { ELoaiBieuMau } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, message, Popconfirm } from 'antd';
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
				autoApprove: item.autoApprove,
				selfAssessmentQuestionsId: item.selfAssessmentQuestionsId,
				selfAssessmentQuestionsName: item.selfAssessmentQuestionsName,
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

	const { record: recActi, setVisibleForm, isView } = useModel('cct.activity');
	const { getModel, danhSach, loading, formSubmiting, postManyEquivalencyModel } = useModel('cct.equivalency');
	const { getAllModel, danhSach: dsAtribute } = useModel('danhmuc.attributes');

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

		return dsAtribute.map((attr: any) => ({
			title: attr.code,
			width: 90,
			align: 'center',
			render: (_: any, field: any) => (
				<Form.Item className='table-form-item' name={[field.name, 'attributes', attr._id]} valuePropName='checked'>
					<Checkbox disabled={isView} />
				</Form.Item>
			),
		}));
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

							form.setFieldValue(['listCoCurricularActivityEquivalency', field.name, 'autoApprove'], role?.autoApprove);

							if (role?.attributes?.length) {
								const attrObj = role.attributes.reduce((acc: any, attr: any) => {
									acc[attr._id] = true;
									return acc;
								}, {});
								form.setFieldValue(['listCoCurricularActivityEquivalency', field.name, 'attributes'], attrObj);
							} else {
								form.setFieldValue(['listCoCurricularActivityEquivalency', field.name, 'attributes'], {});
							}
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
		{
			title: intl.formatMessage({ id: 'activity.equivalency.level' }),
			width: 140,
			render: (_, field) => (
				<Form.Item shouldUpdate noStyle>
					{({ getFieldValue }) => {
						const role = getFieldValue(['listCoCurricularActivityEquivalency', field.name, 'role']);
						return <span>{role?.level?.name ?? '--'}</span>;
					}}
				</Form.Item>
			),
		},
		...attributeColumns,
		{
			title: intl.formatMessage({ id: 'activity.equivalency.auto' }),
			width: 130,
			align: 'center',
			render: (_, field) => (
				<Form.Item className='table-form-item' name={[field.name, 'autoApprove']} valuePropName='checked'>
					<Checkbox
						disabled={isView}
						onChange={(e) => {
							if (e.target.checked) {
								form.setFieldValue(
									['listCoCurricularActivityEquivalency', field.name, 'selfAssessmentQuestionsId'],
									undefined,
								);
								form.setFieldValue(
									['listCoCurricularActivityEquivalency', field.name, 'selfAssessmentQuestionsName'],
									undefined,
								);
							}
						}}
					/>
				</Form.Item>
			),
		},
		{
			title: intl.formatMessage({ id: 'activity.equivalency.question' }),
			width: 260,
			render: (_, field) => (
				<Form.Item shouldUpdate noStyle>
					{({ getFieldValue }) => {
						const autoApprove = getFieldValue(['listCoCurricularActivityEquivalency', field.name, 'autoApprove']);

						return (
							<>
								<Form.Item className='table-form-item' name={[field.name, 'selfAssessmentQuestionsId']}>
									<SelectMauKhaoSat
										disabled={isView || autoApprove}
										condition={{ loai: ELoaiBieuMau.QUESTIONS }}
										size='small'
										allowClear
										onChange={(val, option) => {
											form.setFieldValue(
												['listCoCurricularActivityEquivalency', field.name, 'selfAssessmentQuestionsName'],
												option?.rawData?.tieuDe,
											);
										}}
										placeholder={intl.formatMessage({
											id: 'activity.equivalency.question.place',
										})}
									/>
								</Form.Item>
								<Form.Item hidden name={[field.name, 'selfAssessmentQuestionsName']} />
							</>
						);
					}}
				</Form.Item>
			),
		},
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
			const { rolesId, attributes = {}, autoApprove, selfAssessmentQuestionsId, selfAssessmentQuestionsName } = item;

			const selectedAttributeIds = Object.keys(attributes).filter((id) => attributes[id]);

			if (!selectedAttributeIds.length) {
				result.push({
					activitiesId: recActi?._id,
					rolesId,
					attributesId: null,
					autoApprove,
					selfAssessmentQuestionsId,
					selfAssessmentQuestionsName,
				});
				return;
			}

			selectedAttributeIds.forEach((attrId) => {
				result.push({
					activitiesId: recActi?._id,
					rolesId,
					attributesId: attrId,
					autoApprove,
					selfAssessmentQuestionsId,
					selfAssessmentQuestionsName,
				});
			});
		});

		postManyEquivalencyModel(recActi?._id ?? '', { listCoCurricularActivityEquivalency: result }, getData)
			.then(() => setVisibleForm(false))
			.catch(() => {});
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
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
								onClick={() =>
									add({
										role: null,
										autoApprove: false,
										attributes: {},
									})
								}
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
