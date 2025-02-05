import { useModel } from '@@/plugin-model/useModel';
import ThongKeSingleChoice from '@/pages/TienIch/KhaoSat/DotKhaoSat/ThongKeType/SingleChoice';
import ThongKeMultipleChoice from '@/pages/TienIch/KhaoSat/DotKhaoSat/ThongKeType/MultipleChoice';
import ThongKeGrid from '@/pages/TienIch/KhaoSat/DotKhaoSat/ThongKeType/GridChoice';
import NumericChoice from '@/pages/TienIch/KhaoSat/DotKhaoSat/ThongKeType/NumericChoice';

const ThongKe = () => {
	const { dataThongKeKhaoSat: thongKe } = useModel('sukienv2');

	const renderThongKe = (question: any, index: number) => {
		let questionEleMent = <div />;
		// const recordDapAn = record?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
		if (question.loai === 'SingleChoice' && question?.soLuongTraLoi > 0)
			questionEleMent = <ThongKeSingleChoice ketQua={question.ketQua} tong={question?.soLuongTraLoi ?? 0} />;
		else if (question.loai === 'MultipleChoice' || question.loai === 'DropdownMenu')
			questionEleMent = <ThongKeMultipleChoice ketQua={question.ketQua} />;
		// else if (question.loai === 'Text') questionEleMent = <Text />;
		else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
			questionEleMent = <ThongKeGrid ketQua={question.ketQua} />;
		else if (question.loai === 'NumericRange') questionEleMent = <NumericChoice ketQua={question.ketQua} />;
		return (
			<div key={question?._id}>
				<div className='ant-form-item-label fw500'>
					<label
						className={question.batBuoc ? 'ant-form-item-required' : ''}
						style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}
					>
						Câu {index + 1}: {question.noiDungCauHoi}
					</label>
				</div>
				<br />
				{/* <div className='text-primary' style={{ marginBottom: 8 }}>
					Số lượt trả lời: <b>{question.soLuongTraLoi}</b>{' '}
					{question.loai === 'Text' && <a onClick={() => handleShowDetail(question?._id)}>(Xem chi tiết)</a>}
				</div> */}
				{/*{question.loai === 'Text' && (*/}
				{/*  <ButtonExtend onClick={() => handleShowDetail(question?._id)} type='link'>*/}
				{/*    Xem chi tiết*/}
				{/*  </ButtonExtend>*/}
				{/*)}*/}
				{question.soLuongTraLoi ? questionEleMent : null}
			</div>
		);
	};

	return (
		<>
			<h3>{thongKe?.tieuDe}</h3>
			<p>{thongKe?.moTa}</p>

			{thongKe?.thongKeKhoi?.map((item, index) => {
				return (
					<>
						{
							// eslint-disable-next-line react/no-array-index-key
							<div key={index} style={{ marginBottom: 24 }}>
								<div className='fw500'>{item?.tieuDe}</div>
								<div>{item?.moTa}</div>

								{item?.thongKeCauHoi?.map((cauHoi, i) => renderThongKe(cauHoi, i))}
							</div>
						}
					</>
				);
			})}
		</>
	);
};
export default ThongKe;
