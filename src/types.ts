
export interface SetParam {
  key: string;
  value: any;
}

export interface Expression {
  ExpressionAttributeNames: Record<string,any>;
  ExpressionAttributeValues: Record<string,any>;
  UpdateExpression: string;
}