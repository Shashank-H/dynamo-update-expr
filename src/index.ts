import { Expression, SetParam } from "./types";

// !TODO write tests -

export class DynamoExpression {
  ExpressionAttributeNames : Record<string,string> = {};
  ExpressionAttributeValues : Record<string,any> = {};
  UpdateExpression : string = '';

  keyName : Record<string,string> = {};

  constructor(){
  }

  /**
   * function to generate a DynamoExpression which will SET some values in the DB
   * @param {Array<SetParam>} items - Array of setParams to the DynamoExpression
   * @returns {DynamoExpression} new DynamoExpression object
  */
  set(items: Array<SetParam>) : DynamoExpression {

    this.UpdateExpression += ' SET ',

    items.forEach(({key,value},indexI) =>{
      // handling nested keys 
      // say keys like user.name.first or car.core.engine.power
      let keyNestings = key.split('.');
    
      keyNestings.forEach((keyItem,indexJ) =>{
        // to avoid re-declaring any existing key for attribute names 
        if(this.keyName[`${keyItem}`]){
          this.UpdateExpression += `${this.keyName[`${keyItem}`]}${keyNestings[indexJ+1]?'.':' = '}`;
        }
        else{
          this.ExpressionAttributeNames[`#key${indexI}${indexJ}`] = `${keyItem}`;
          
          // adding the keyName to the keyName Object to inform existence of the key.
          this.keyName[`${keyItem}`] = `#key${indexI}${indexJ}`;
  
          this.UpdateExpression += `#key${indexI}${indexJ}${keyNestings[indexJ+1]?'.':' = '}`;
        }
      })

      // finally adding value for the given K,V pair.
      this.ExpressionAttributeValues[`:value${indexI}`] = value;
      this.UpdateExpression += `:value${indexI} ${items[indexI+1]?', ': ' '}`
    })

    return this;
  }

  // !TODO: Add methods for REMOVE, ADD, DELETE as well. 

  /**
   * function to get the expression object to directly pass to the Dynamodb update call
   * @returns {Expression} generated dynamo expression
  */
  asExpression() : Expression {

    return {
      ExpressionAttributeNames : {...this.ExpressionAttributeNames},
      ExpressionAttributeValues : {...this.ExpressionAttributeValues},
      UpdateExpression: this.UpdateExpression
    }
  }
}