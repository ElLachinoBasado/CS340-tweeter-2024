import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DAOInterface } from "../dao/DAOInterface";

export abstract class Factory<D extends DAOInterface> {
  readonly client: DynamoDBDocumentClient;
  readonly DAO: D;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
    this.DAO = this.createDAO();
  }

  protected abstract createDAO(): D;
}
