import CCT from './CCT';
import activity from './CCT/activity';
import activityresult from './CCT/activityresult';
import danhmuc from './danhmuc';
import login from './login';

export default {
	...login,
	...danhmuc,
	...activity,
	...activityresult,
	...CCT,
};
