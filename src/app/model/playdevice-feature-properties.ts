/**
 * @author Edgar Butwilowski
 * @copyright Copyright (c) Vermessungsamt Winterthur. All rights reserved.
 */
import { PlaydeviceDetail } from './playdevice-detail';
import { InspectionCriterion } from './inspection-criterion';
import { InspectionReport } from './inspection-report';
import { Defect } from './defect';
export class PlaydeviceFeatureProperties {
    fid: number = 0;
    supplier: string = "";
    material: string = "";
    lebensdauer: number = 0;
    type: PlaydeviceFeaturePropertiesType = new PlaydeviceFeaturePropertiesType();
    dateOfService?: Date = undefined;

    generalInspectionCriteria: InspectionCriterion[] = [];
    mainFallProtectionInspectionCriteria: InspectionCriterion[] = [];
    secondaryFallProtectionInspectionCriteria: InspectionCriterion[] = [];
    costEstimation?: number;
    recommendedYearOfRenovation?: number;
    commentRecommendedYearOfRenovation: string = "";
    defects: Defect[] = [];  // "known/old" defects from web service
    lastInspectionReports: InspectionReport[] = [];
    nextToLastInspectionReports: InspectionReport[] = [];

    pictureBase64String: string = "";
    mapImageBase64String: string = "";

      // only local:
    hasChecks: boolean = false;
    hasOldReports: boolean = false;
    hasOpenChecks: boolean = false;
    hasOpenDefects: boolean = false;
    someOldDefectsAreDone: boolean = false;

}

export class PlaydeviceFeaturePropertiesType
{
    name: string = "";
    description: string = "";
    standard: string = "";
}