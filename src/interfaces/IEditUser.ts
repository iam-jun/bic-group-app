export type GENDER_TYPE = 'MALE' | 'FEMALE' | 'OTHERS' | undefined;
export type RELATIONSHIP_TYPE =
  | 'SINGLE'
  | 'IN_A_RELATIONSHIP'
  | 'ENGAGED'
  | 'MARRIED';

export interface IGenderItem {
  type: GENDER_TYPE;
  title: string;
}

export interface ILanguageItem {
  type: string;
  title: string;
}

export interface IRelationshipItem {
  type: RELATIONSHIP_TYPE;
  title: string;
}
