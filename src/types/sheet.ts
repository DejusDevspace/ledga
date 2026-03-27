export interface UserSheet {
  id: string;
  userId: string;
  sheetId: string;
  sheetLabel: string;
  formUrl?: string;
  isPrimary: boolean;
  createdAt: string;
}
