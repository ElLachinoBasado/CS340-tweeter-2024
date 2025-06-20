export interface View {
  displayErrorMessage(message: string): void;
}

export abstract class Presenter<V extends View, S> {
  private _view: V;
  private _service: S;

  public constructor(view: V) {
    this._view = view;
    this._service = this.createService();
  }

  protected get view(): V {
    return this._view;
  }

  public get service() {
    return this._service;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    finalOperation?: () => void
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${
          (error as Error).message
        }`
      );
    } finally {
      if (!!finalOperation) {
        finalOperation();
      }
    }
  }

  protected abstract createService(): S;
}
