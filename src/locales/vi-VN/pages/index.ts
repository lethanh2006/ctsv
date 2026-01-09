import activity from './activity';
import CCT from './CCT';
import chinhtritutuong from './chinhtritutuong';
import danhmuc from './danhmuc';
import donvihanhchinh from './donvihanhchinh';
import login from './login';
import loptinchi from './loptinchi';
import namhoc from './namhoc';
import sinhvien from './sinhvien';
import thongbao from './thongbao';
import thongkebaocao from './thongkebaocao';
import thongtinnguoihoc from './thongtinnguoihoc';
import trangchu from './trangchu';

export default {
	...login,
	...sinhvien,
	...namhoc,
	...trangchu,
	...donvihanhchinh,
	...loptinchi,
	...thongtinnguoihoc,
	...activity,
	...danhmuc,
	...thongbao,
	...chinhtritutuong,
	...CCT,  
	...thongkebaocao,
};
