import activity from './activity';
import activityresult from './activityresult';
import danhmuc from './danhmuc';
import login from './login';

export default {
	...login,
	...danhmuc,
	...activity,
	...activityresult,
};
