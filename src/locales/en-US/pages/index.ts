import activities from './danhmuc/activities';
import attributes from './danhmuc/attributes';
import levels from './danhmuc/levels';
import questions from './danhmuc/questions';
import roles from './danhmuc/roles';
import login from './login';

export default {
	...login,
	...attributes,
	...levels,
	...roles,
	...activities,
	...questions,
};
