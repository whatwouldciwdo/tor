// Types for ToR Form
export interface TorFormData {
  id?: number;
  number?: string;
  title: string;
  description?: string;
  bidangId?: number;
  
  // Tab 1: Informasi Umum
  creationDate?: string;
  creationYear?: number;
  budgetType?: string;
  workType?: string;
  program?: string;
  rkaYear?: number;
  projectStartDate?: string;
  projectEndDate?: string;
  executionYear?: number;
  materialJasaValue?: number;
  budgetCurrency?: string | null;
  budgetAmount?: number | null;
  coverImage?: string | null;
  
  // Tab 2: Pendahuluan
  introduction?: string;
  background?: string;
  objective?: string;
  scope?: string;
  
  // Tab 3: Tahapan Pekerjaan
  duration?: number;
  durationUnit?: string;
  technicalSpec?: string;
  generalProvisions?: string;
  deliveryPoint?: string;
  deliveryMechanism?: string;
  
  // Tab 4: Usulan
  directorProposal?: string;
  fieldDirectorProposal?: string;
  vendorRequirements?: string;
  procurementMethod?: string;
  paymentTerms?: string;
  penaltyRules?: string;
  otherRequirements?: string;
  subtotal?: number;
  ppn?: number;
  pph?: number;
  grandTotal?: number;
  
  // Tab 6: Lampiran
  tpgData?: any;
  itpData?: any;
  drsData?: any;
  pgrsData?: any;
  
  // Budget Items
  budgetItems?: BudgetItem[];
  
  // Metadata
  statusStage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetItem {
  id?: number;
  item: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  orderIndex?: number;
}

export interface Tor extends TorFormData {
  id: number;
  number: string;
  bidang?: {
    id: number;
    name: string;
    code?: string;
  };
  creator?: {
    id: number;
    name: string;
    position?: {
      name: string;
    };
  };
  currentStepNumber: number;
  statusStage: string;
  isFinalApproved: boolean;
  isExported: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TabId = 
  | "informasi-umum"
  | "pendahuluan"
  | "tahapan-pekerjaan"
  | "usulan"
  | "lembar-pengesahan"
  | "lampiran";

export interface Tab {
  id: TabId;
  label: string;
  component: React.ComponentType<TabProps>;
}

export interface TabProps {
  formData: TorFormData;
  onChange: (data: Partial<TorFormData>) => void;
  errors?: Record<string, string>;
}
