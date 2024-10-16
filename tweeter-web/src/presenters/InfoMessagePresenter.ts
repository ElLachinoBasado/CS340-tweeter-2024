import { IsLoadingPresenter } from "./IsLoadingPresenter";
import { View } from "./Presenter";

export interface InfoMessageView extends View {
  displayInfoMessage(message: string, duration: number): void;
  clearLastInfoMessage(): void;
}

export abstract class InfoMessagePresenter<
  V extends InfoMessageView,
  S
> extends IsLoadingPresenter<V, S> {
  protected finallyClearInfoMessage = () => {
    this.view.clearLastInfoMessage();
    this.isLoading = false;
  };
}
