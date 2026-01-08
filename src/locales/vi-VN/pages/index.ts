import activity from './activity';
import danhmuc from './danhmuc';
import donvihanhchinh from './donvihanhchinh';
import login from './login';
import loptinchi from './loptinchi';
import namhoc from './namhoc';
import sinhvien from './sinhvien';
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
};
