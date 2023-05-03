export interface IDataToSave {
  id: any;
  name: string;
  uid: string;
  description: string;
}
export interface IDataWithComment extends IDataToSave {
  comment?: string;
}

export interface IMasterFileDataToSave {
  competencyToSave: IDataToSave;
  skillToSave: IDataToSave;
  topicToSave: IDataWithComment;
}
