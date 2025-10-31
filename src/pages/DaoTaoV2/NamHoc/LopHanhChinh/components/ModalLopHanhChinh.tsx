import access from '@/access';
import NhanSuHocKy from '@/pages/DaoTaoV2/HocKy/NhanSuHocKy';
import SinhVienHocKy from '@/pages/DaoTaoV2/HocKy/SinhVienHocKy';
import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CoVanLopHanhChinhNamHoc from '../../CoVanLopHanhChinhNamHoc';
import SinhVienLopHanhChinh from '../../SvLopHanhChinh';
import SinhVienLopHanhChinhNamHoc from '../../SvLopHanhChinhNamHoc';
import FormLopHanhChinh from './Form';

const ModalLopHanhChinh = (props: any) => {
	const intl = useIntl();
	const { record, edit } = useModel('daotaov2.namhoc.lophanhchinh');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState(0);
	const { lopTinChiHocKyAccessFilter } = access({});

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	if (lopTinChiHocKyAccessFilter()) {
		return (
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
				<Steps
					current={currentStep}
					style={{ marginBottom: 18, paddingTop: 0 }}
					onChange={record?._id ? onChangeStep : undefined}
					type='navigation'
				>
					{/* <Steps.Step title={intl.formatMessage({ id: 'namhoc.namhoc.step1' })} /> */}
					{/* <Steps.Step title={intl.formatMessage({ id: 'namhoc.lophanhchinh.tab2' })} disabled={!record?._id} /> */}
					<Steps.Step title={'Sinh viên và ban cán sự lớp'} disabled={!record?._id} />
					<Steps.Step title={'Cố vấn học tập'} disabled={!record?._id} />
				</Steps>

				{/* {currentStep === 0 ? (
				<FormLopHanhChinh afterAddNew={() => setCurrentStep(1)} />
			) :  */}
				{currentStep === 0 ? (
					<SinhVienHocKy lopHanhChinh={record} />
				) : currentStep === 1 ? (
					<NhanSuHocKy lopHanhChinh={record} />
				) : (
					<SinhVienLopHanhChinhNamHoc lopHanhChinh={record} />
				)}
			</Card>
		);
	}

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.namhoc.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.lophanhchinh.tab2' })} disabled={!record?._id} />
				<Steps.Step title={'Cố vấn học tập'} disabled={!record?._id} />
				<Steps.Step title={'Ban cán sự lớp'} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormLopHanhChinh afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<SinhVienLopHanhChinh hideCard />
			) : currentStep === 2 ? (
				<CoVanLopHanhChinhNamHoc lopHanhChinh={record} />
			) : (
				<SinhVienLopHanhChinhNamHoc lopHanhChinh={record} />
			)}
		</Card>
	);
};

export default ModalLopHanhChinh;
