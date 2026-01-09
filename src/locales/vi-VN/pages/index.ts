import CCT from './CCT';
import chedochinhsach from './chedochinhsach';
import chinhtritutuong from './chinhtritutuong';
import danhmuc from './danhmuc';
import donvihanhchinh from './donvihanhchinh';
import login from './login';
import loptinchi from './loptinchi';
import namhoc from './namhoc';
import phuvucongdong from './phuvucongdong';
import sinhvien from './sinhvien';
import thongbao from './thongbao';
import thongtinnguoihoc from './thongtinnguoihoc';
import trangchu from './trangchu';
import vanhoathethao from './vanhoathethao';

export default {
	...login,
	...sinhvien,
	...namhoc,
	...trangchu,
	...donvihanhchinh,
	...loptinchi,
	...thongtinnguoihoc,
	...danhmuc,
	...thongbao,
	...chinhtritutuong,
	...CCT,
	...phuvucongdong,
	...vanhoathethao,
	...chedochinhsach,
};
