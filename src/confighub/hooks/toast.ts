import { CommonServiceIds, IGlobalMessagesService } from 'azure-devops-extension-api';
import * as SDK from 'azure-devops-extension-sdk';

function useExternalToast(): (message: string, duration: number) => Promise<void> {
  return async function(message: string, duration: number) {
    const globalMessagesSvc = await SDK.getService<IGlobalMessagesService>(
      CommonServiceIds.GlobalMessagesService
    );
    globalMessagesSvc.addToast({
      duration: duration,
      message: message,
    });
  };
}

export { useExternalToast };
