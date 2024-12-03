export abstract class Factory {
  readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }
}
