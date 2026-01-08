import activity from './activity';
import danhmuc from './danhmuc';
import hosonguoihoc from './daotao/hosonguoihoc';
import kyluatkhenthuong from './daotao/kyluatkhenthuong';
import lichthi from './daotao/lichthi';
import sinhvienhocvu from './daotao/sinhvienhocvu';
import donvihanhchinh from './donvihanhchinh';
import login from './login';
import loptinchi from './loptinchi';
import namhoc from './namhoc';
import sinhvien from './sinhvien';
import thongbao from './thongbao';
import thongtinnguoihoc from './thongtinnguoihoc';
import trangchu from './trangchu';

export default {
	...login,
	...sinhvien,
	...namhoc,
	...trangchu,
	...donvihanhchinh,
	// Đào tạo V2
	...hosonguoihoc,
	...lichthi,
	...loptinchi,
	...sinhvienhocvu,
	...kyluatkhenthuong,
	...thongtinnguoihoc,
	...activity,
	...danhmuc,
	...thongbao,
};
