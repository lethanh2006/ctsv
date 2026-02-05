import { Activity } from '../Activity/typing';
import { EActivityCategory, EApprovalStatus } from '../constant';

declare module ActivityOutCome {
	export interface IRecord {
		_id: string;
		name: string;
		email: string;
		activitiesOutcomeName: string;
		activitiesId: string;
		activities: Activity.IRecord;
		activitiesTypeId: string;
		activitiesType: ActivitiesManagement.IRecord;
		rolesId: string;
		roles?: RolesManagement.IRecord;
		levelsId: string;
		levels?: LevelsManagement.IRecord;
		organizer: string;
		description: string;
		location: string;
		learningOutcomes: string;
		file: string[] | null;
		answerId: string;
		selfAssessmentQuestionsId: string;
		workflow: EApprovalStatus;
		activityCategory: EActivityCategory;
		studentDeclarationApproverName: string;
		studentDeclarationApproverSsoId: string;
		activityRejectionNote: string;
		revisionNote: string;
		validation: Evalidation;
		reflection: string;
		evidenceFile: {
			name: string;
			file: string[];
		}[];
		startDate: Date;
		endDate: Date;

		listAchievedCompetencies: Activity.ICompetencyMapping[];
		competencyList: ICompetencyActivity[];

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IAnalyticsStaff {
		pending: number;
		processed: number;
		total: number;
	}

	export interface IAnalyticsApprovers {
		total: number;
		processed: number;
		pending: number;
		unassigned: number;
	}

	export interface ICompetencyMapping {
		_id: string;
		index?: number;
		activityOutcomeId: string;
		activityOutcome?: IRecord;
		competencieId: string;
		competencie?: Competency.IRecord;
		attributesId: string;
		attributes?: AttributesManagement.IRecord;

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
