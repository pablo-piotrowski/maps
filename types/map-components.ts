import { FishCatch } from "./fish-catch";

export type FishCatchFormData = {
  fish: string;
  length: string;
  weight: string;
};

export type SubmitMessage = {
  type: "success" | "error";
  text: string;
};

export type FishCatchFormProps = {
  formData: FishCatchFormData;
  isSubmitting: boolean;
  submitMessage: SubmitMessage | null;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export type FishCatchesTableProps = {
  catches: FishCatch[];
  isLoading: boolean;
  currentUserId?: number;
};

export type PopupInfo = {
  longitude: number;
  latitude: number;
  properties: unknown;
};

export type LakeDrawerProps = {
  popupInfo: PopupInfo | null;
  isOpen: boolean;
  onClose: () => void;
  lakeCatches: FishCatch[];
  isLoadingCatches: boolean;
  currentUserId?: number;
  formData: FishCatchFormData;
  isSubmitting: boolean;
  submitMessage: SubmitMessage | null;
  onInputChange: (field: string, value: string) => void;
  onFormSubmit: (e: React.FormEvent) => void;
};
