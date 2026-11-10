export type UserRole = 'user' | 'admin';

export interface UserAccountDetails {
  easypaisaNumber: string;
  jazzcashNumber: string;
  accountHolderName: string;
}

export interface User {
  id: string; // e.g. "E4U-91823"
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  referralCode: string; // e.g. "E4U8821"
  referredBy?: string; // referral code of inviter
  phone?: string;
  createdAt: string;
  status: 'active' | 'blocked';
  accountDetails: UserAccountDetails;
}

export interface Package {
  id: string;
  name: string; // e.g. "VIP 1"
  price: number; // in PKR (Rs.)
  dailyTaskLimit: number;
  proposedReturnRate: number; // e.g. 2 means 2%
  dailyEarningEst: number; // Rs. per day approx
  description: string;
  image?: string;
  durationDays: number; // e.g. 30 days
  status: 'active' | 'inactive';
  minPurchase: number;
  maxPurchase: number;
  badgeColor?: string;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  price: number;
  dailyTaskLimit: number;
  proposedReturnRate: number;
  purchaseDate: string;
  expiryDate: string;
  tasksCompletedToday: number;
  lastTaskDate: string; // YYYY-MM-DD
  status: 'active' | 'expired';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  reward: number; // in Rs.
  youtubeVideoUrl: string; // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
  youtubeVideoId: string;
  channelSubscribeUrl?: string;
  channelName?: string;
  durationSeconds: number; // default 30
  category: 'Video Watch' | 'Channel Subscribe' | 'Video & Subscribe';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  reward: number;
  status: 'completed' | 'under_review' | 'approved' | 'rejected';
  completedAt: string;
  watchDurationSeconds: number;
  screenshotUrl?: string;
}

export interface DepositRequest {
  id: string; // e.g. "DEP-10294"
  userId: string;
  userName: string;
  userEmail: string;
  paymentMethod: 'Easypaisa' | 'JazzCash' | 'NayaPay';
  amount: number;
  transactionId: string; // Unique TID / TRX ID
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface WithdrawalRequest {
  id: string; // e.g. "WTH-58291"
  userId: string;
  userName: string;
  userEmail: string;
  paymentMethod: 'Easypaisa' | 'JazzCash';
  accountHolderName: string;
  accountNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  paymentReference?: string;
}

export type TransactionType =
  | 'deposit'
  | 'package_purchase'
  | 'task_reward'
  | 'referral_commission'
  | 'withdrawal'
  | 'withdrawal_refund'
  | 'admin_adjustment';

export interface WalletTransaction {
  id: string;
  referenceId: string; // e.g. TRX-90218
  userId: string;
  type: TransactionType;
  amount: number; // positive or negative
  balanceAfter: number;
  date: string;
  status: 'completed' | 'pending' | 'rejected';
  description: string;
  metadata?: Record<string, any>;
}

export interface UserWallet {
  userId: string;
  availableBalance: number;
  totalDeposited: number;
  totalPurchased: number;
  totalWithdrawn: number;
  totalTaskEarnings: number;
  totalReferralEarnings: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export interface ReferralCommissionRecord {
  id: string;
  referrerUserId: string;
  buyerUserId: string;
  buyerName: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  level: 1 | 2 | 3;
  commissionPercentage: number;
  commissionAmount: number;
  date: string;
}

export interface PaymentAccountConfig {
  accountTitle: string;
  accountNumber: string;
  instructions: string;
  enabled: boolean;
  qrCodeUrl?: string;
}

export interface PaymentSettings {
  easypaisa: PaymentAccountConfig;
  jazzcash: PaymentAccountConfig;
  nayapay: PaymentAccountConfig;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFeePercentage: number;
  withdrawalProcessingTime: string;
}

export interface WhatsAppSettings {
  channelUrl: string;
  channelTitle: string;
  channelDescription: string;
  showChannel: boolean;
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  level1CommissionRate: number; // default 5%
  level2CommissionRate: number; // default 3%
  level3CommissionRate: number; // default 2%
  referralSystemEnabled: boolean;
  autoApproveTasks: boolean;
}

export interface SupportTicketMessage {
  id: string;
  senderRole: 'user' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Deposit' | 'Withdrawal' | 'Task' | 'Package' | 'Other';
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
