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

		createdAt: Date;
		updatedAt: Date;
	}

	export interface IAnalyticsStaff {
		pending: number;
		processed: number;
		total: number;
	}
}
