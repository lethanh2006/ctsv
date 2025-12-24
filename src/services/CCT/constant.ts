export enum EParticipantScope {
	USER_LIST = 'UserList',
	UNIVERSITY = 'University',
	STUDENT = 'StudentCohort',
	MAJOR = 'Major',
	COURSE_CLASS = 'CourseClass',
	UNIT = 'Unit',
}

export enum EparticipantRole {
	STUDENT = 'Student',
	STAFF = 'Staff',
	ALL = 'All',
}

export const mapNameParticipantScope: Record<EParticipantScope, string> = {
	[EParticipantScope.USER_LIST]: 'User List',
	[EParticipantScope.UNIVERSITY]: 'University',
	[EParticipantScope.STUDENT]: 'Student Cohort',
	[EParticipantScope.MAJOR]: 'Major',
	[EParticipantScope.COURSE_CLASS]: 'Course Class',
	[EParticipantScope.UNIT]: 'Unit',
};

export const mapNameParticipantRole: Record<EparticipantRole, string> = {
	[EparticipantRole.STUDENT]: 'Student',
	[EparticipantRole.STAFF]: 'Staff',
	[EparticipantRole.ALL]: 'All',
};
