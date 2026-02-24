import { EparticipantRole, EParticipantScope } from '../constant';

declare module Activity {
	export interface IRecord {
		_id: string;
		name: string;
		startDate: Date;
		endDate: Date;
		banner: string;
		backgroundImage: string;
		organizer?: string;
		codeOrganizer?: string;

		onCampus: boolean;
		facilityCode: string;
		facilityName: string;
		otherAddress: string;

		description: string;

		participantScope: EParticipantScope;
		participantsList: IParticipantsList[];
		participantRole: EparticipantRole;
		facultyCode: string;
		studentCohortCode: string;
		majorCode: string;
		courseClassCode: string;
		unitCode: string;

		allowPostEventResultsUpdate?: boolean;
		dueDate: Date;

		activitiesTypeId: string | null;
		activitiesType: ActivitiesManagement.IRecord;
		featuredActivities: boolean;

		studentDeclarationApproverList: ActivitiesManagement.IStudentDeclaration[];

		coCurricularActivityEquivalency: IEquivalency[];
		coCurricularAttributesEquivalency: ICompetencyMapping[];
		competencyList: IComapetencyActivity[];

		numberOfRegisteredActivityOutcomes?: number;
		numberOfApprovedActivityOutcomes?: number;
		numberOfAddEvidenceActivityOutcomes?: number;

		allowActivityRegistration: boolean;
		capacity: number | null;
		dueDateRegistration: Date | null;

		activityOutcomes: ActivityOutCome.IRecord;

		workflow: EApprovalStatus;

		//fake && ActivytOutcome
		cct?: boolean;
		supervisorName?: string;
		revisionNote?: string;
		reflection?: string;
		validation?: Evalidation;
		rolesId?: string;
		roles?: RolesManagement.IRecord;
		levelsId?: string;
		levels?: LevelsManagement.IRecord;
		trackId?: string;
		tracks?: TrackManagement.IRecord;
		evidenceFile?: {
			name: string;
			file: string[];
		}[];
	}

	export interface IParticipantsList {
		_id: string;
		index: number;
		ssoId: string;
		name: string;
		email: string;
		participantRole: EparticipantRole;
		activitiesId: string;
		activities: string;
	}

	export interface IEquivalency {
		_id: string;
		activitiesId: string;
		activities?: ActivitiesManagement.IRecord;
		rolesId: string;
		roles?: RolesManagement.IRecord;
		attributesId: string;
		attributes?: AttributesManagement.IRecord;
		autoApprove: boolean;
		selfAssessmentQuestionsId: string;
		selfAssessmentQuestionsName: string;
	}

	export type IAnalyticsActivity = {
		completed: number;
		ongoing: number;
		total: number;
		upcoming: number;
	};

	export interface ICompetencyMapping {
		_id: string;
		index?: number;
		activitiesId: string;
		activities?: IRecord;
		competencieId: string;
		competencie?: Competency.IRecord;
		attributesId: string;
		attributes?: AttributesManagement.IRecord;

		//fake
		dsCompetencie?: Competency.IRecord[];
	}

	export interface ICompetencyActivity {
		_id: string;
		competencyId: string;
		activitiesId: string;
		competency: Competency.IRecord;
		activities: IRecord;
	}
}
