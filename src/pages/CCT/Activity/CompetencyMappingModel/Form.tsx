import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, message, Row, Select } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCompetencyMappingModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData } = props;
	const { record: recActivity } = useModel('cct.activity');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting, record, danhSach } =
		useModel('cct.competencymapping');
	const { getAllModel: getAllAttributes, danhSach: dsattributes } = useModel('danhmuc.attributes');
	const {
		getAllModel: getAllAttriCompetency,
		danhSach: dscompetency,
		loading,
		setDanhSach,
	} = useModel('danhmuc.competencyattributes');
	const competencieId: string[] = Form.useWatch('competencieId', form);
	const attributesId: string = Form.useWatch('attributesId', form);

	const selectedAttributeIds =
		danhSach?.map((item) => item.attributesId)?.filter((item) => item !== attributesId) ?? [];

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setDanhSach([]);
		} else {
			form.setFieldsValue({
				...record,
				competencieId: record?.dsCompetencie?.map((item) => item?._id),
			});

			getAllAttributes(undefined, { order: 1 }, { isActive: true });
		}
	}, [visibleForm]);

	useEffect(() => {
		if (attributesId) {
			getAllAttriCompetency(undefined, undefined, { attributesId: attributesId });
		}
	}, [attributesId]);

	const onFinish = async (values: any) => {
		if ((danhSach?.length ?? 0) > 2) {
			return message.error('An activity can have a maximum of 2 attributes.');
		}

		if (edit) {
		} else {
			const payload = (values.competencieId || []).map((id: string) => ({
				activitiesId: recActivity?._id,
				attributesId: values.attributesId,
				competencieId: id,
			}));

			for (const item of payload) {
				await postModel(item, () => {});
			}

			getData();
			setVisibleForm(false);
		}
	};

	const columns: IColumn<Competency.ICompetencyAttributes>[] = [
		{
			title: intl.formatMessage({ id: 'competency.column.name' }),
			dataIndex: ['competency', 'name'],
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Typical Activity',
			dataIndex: ['competency', 'typicalActivityList'],
			width: 250,
			render: (val, rec) => val && <ExpandText>{val.filter(Boolean).join(', ')}</ExpandText>,
		},
	];

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item
						name='attributesId'
						label={intl.formatMessage({ id: 'activity.info.form.ccd.attribute' })}
						rules={[...rules.required]}
					>
						<Select
							value={danhSach}
							options={dsattributes
								?.filter((item) => !selectedAttributeIds.includes(item._id))
								?.map((item) => ({
									key: item._id,
									value: item._id,
									label: item.name,
								}))}
							showSearch
							optionFilterProp='label'
							placeholder={intl.formatMessage({ id: 'attributesmanagement.select.place' })}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='competencieId' label={intl.formatMessage({ id: 'activity.info.form.ccd.competency' })}>
						{competencieId?.length > 3 && (
							<i className='text-error'>An Attribute can have a maximum of 3 Competency points.</i>
						)}
						<TableStaticData
							columns={columns}
							data={uniqBy(dscompetency ?? [], 'competencyId')}
							loading={loading}
							size='small'
							hasTotal
							otherProps={{
								pagination: false,
								scroll: { y: 350 },
								rowKey: 'competencyId',
								rowSelection: {
									type: 'checkbox',
									columnWidth: 40,
									selectedRowKeys: competencieId ?? [],
									onChange: (selectedRowKeys: React.Key[]) => {
										form.setFieldsValue({
											competencieId: selectedRowKeys,
										});
									},
								},
							}}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary' loading={formSubmiting} disabled={competencieId?.length > 3}>
					{!edit
						? intl.formatMessage({ id: 'global.button.themmoi' })
						: intl.formatMessage({ id: 'global.button.chinhsua' })}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Form>
	);
};

export default FormCompetencyMappingModel;
