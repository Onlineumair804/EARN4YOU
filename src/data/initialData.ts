import {
  User,
  Package,
  Task,
  PaymentSettings,
  WhatsAppSettings,
  WebsiteSettings,
  DepositRequest,
  WithdrawalRequest,
  WalletTransaction,
  UserPackage,
  SupportTicket,
  AuditLog
} from '../types';

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg-vip-1',
    name: 'VIP 1',
    price: 500,
    dailyTaskLimit: 2,
    proposedReturnRate: 2,
    dailyEarningEst: 10,
    description: 'Entry-level starter package for new members. Complete 2 daily 30-second YouTube tasks.',
    durationDays: 30,
    status: 'active',
    minPurchase: 1,
    maxPurchase: 1,
    badgeColor: 'from-amber-600 to-amber-700'
  },
  {
    id: 'pkg-vip-2',
    name: 'VIP 2',
    price: 1000,
    dailyTaskLimit: 5,
    proposedReturnRate: 2,
    dailyEarningEst: 20,
    description: 'Popular high-frequency package with 5 daily 30s tasks and steady rewards.',
    durationDays: 30,
    status: 'active',
    minPurchase: 1,
    maxPurchase: 2,
    badgeColor: 'from-blue-600 to-cyan-700'
  },
  {
    id: 'pkg-vip-3',
    name: 'VIP 3',
    price: 2500,
    dailyTaskLimit: 10,
    proposedReturnRate: 3,
    dailyEarningEst: 75,
    description: 'Gold level tier with 10 high-paying daily tasks and priority withdrawal processing.',
    durationDays: 30,
    status: 'active',
    minPurchase: 1,
    maxPurchase: 3,
    badgeColor: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'pkg-vip-4',
    name: 'VIP 4',
    price: 5000,
    dailyTaskLimit: 15,
    proposedReturnRate: 4,
    dailyEarningEst: 200,
    description: 'Maximum elite VIP package. Up to 15 daily YouTube watch & subscribe tasks.',
    durationDays: 30,
    status: 'active',
    minPurchase: 1,
    maxPurchase: 5,
    badgeColor: 'from-purple-600 to-pink-600'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    packageId: 'pkg-vip-1',
    title: 'Watch & Subscribe: EARN4YOU Official Welcome & Strategy',
    description: 'Watch this 30-second introductory guide and subscribe to the official channel to unlock task rewards.',
    instructions: '1. Click Start Task. 2. Watch the video for full 30 seconds. 3. Click Subscribe button. 4. Wait for timer completion to claim Rs. 15 reward.',
    reward: 15,
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    channelSubscribeUrl: 'https://youtube.com/@earn4you_official?sub_confirmation=1',
    channelName: 'EARN4YOU Official Network',
    durationSeconds: 30,
    category: 'Video & Subscribe',
    status: 'active',
    createdAt: '2026-11-01T08:00:00Z'
  },
  {
    id: 'task-2',
    packageId: 'pkg-vip-1',
    title: 'Financial Wisdom: How Compounding Multiplies Wealth',
    description: 'Learn modern digital income management and watch the featured clip for at least 30 seconds.',
    instructions: 'Keep the video active inside the platform for 30 seconds. Do not switch tabs. Reward will be deposited automatically.',
    reward: 12,
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    youtubeVideoId: 'kXYiU_JCYtU',
    channelSubscribeUrl: 'https://youtube.com/@FinGrowthHub',
    channelName: 'Financial Freedom Lab',
    durationSeconds: 30,
    category: 'Video Watch',
    status: 'active',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'task-3',
    packageId: 'pkg-vip-2',
    title: 'Digital Marketing Mastery: Channel Growth 2026',
    description: 'Boost engagement by viewing this trending video presentation for 30 seconds.',
    instructions: 'Watch minimum 30 seconds. Anti-cheat timer monitors progress.',
    reward: 10,
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    youtubeVideoId: 'fJ9rUzIMcZQ',
    channelSubscribeUrl: 'https://youtube.com/@MarketingTech',
    channelName: 'Media Growth Daily',
    durationSeconds: 30,
    category: 'Video & Subscribe',
    status: 'active',
    createdAt: '2026-11-03T11:00:00Z'
  },
  {
    id: 'task-4',
    packageId: 'pkg-vip-2',
    title: 'Mobile Banking & Fast Transfers in Pakistan (Tutorial)',
    description: 'Essential tutorial on fast Easypaisa & JazzCash transfer security.',
    instructions: 'Watch the full 30-second instructional clip and hit Subscribe to claim.',
    reward: 14,
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeVideoId: 'L_LUpnjgPso',
    channelSubscribeUrl: 'https://youtube.com/@PakFinTechNews',
    channelName: 'Fintech Pakistan',
    durationSeconds: 30,
    category: 'Video & Subscribe',
    status: 'active',
    createdAt: '2026-11-04T12:00:00Z'
  },
  {
    id: 'task-5',
    packageId: 'pkg-vip-3',
    title: 'Crypto & Stable Asset Analysis Clip',
    description: 'Daily global economic overview. Watch 30 seconds to support sponsored creators.',
    instructions: 'Play video inside viewer for 30 seconds and receive instant verified credit.',
    reward: 12,
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    youtubeVideoId: '9bZkp7q19f0',
    channelSubscribeUrl: 'https://youtube.com/@GlobalFinanceWatch',
    channelName: 'Global Markets 24/7',
    durationSeconds: 30,
    category: 'Video Watch',
    status: 'active',
    createdAt: '2026-11-05T14:30:00Z'
  }
];

export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  easypaisa: {
    accountTitle: 'EARN4YOU OFFICIAL PVT',
    accountNumber: '0304-9871234',
    instructions: 'Transfer required amount via Easypaisa App or *786#. Copy 11-digit TID (Transaction ID) and upload receipt screenshot.',
    enabled: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Easypaisa-03049871234'
  },
  jazzcash: {
    accountTitle: 'EARN4YOU TREASURY',
    accountNumber: '0321-4567890',
    instructions: 'Send money to JazzCash account. Enter TID from SMS/App confirmation for instant approval.',
    enabled: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=JazzCash-03214567890'
  },
  bankTransfer: {
    accountTitle: 'EARN4YOU ENTERPRISES (Meezan Bank)',
    accountNumber: 'PK36MEZN0001234567890123',
    instructions: 'Direct Bank Transfer / IBAN deposit. Upload bank receipt with transaction reference number.',
    enabled: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MeezanBank-PK36MEZN0001234567890123'
  },
  customQr: {
    accountTitle: 'EARN4YOU UNIVERSAL QR',
    accountNumber: 'E4U-GLOBAL-QR-PAY',
    instructions: 'Scan QR code using any supported mobile banking app or wallet. Enter transaction reference ID.',
    enabled: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EARN4YOU-CUSTOM-QR-PAYMENT'
  },
  minDeposit: 500,
  maxDeposit: 100000,
  minWithdrawal: 300,
  maxWithdrawal: 50000,
  withdrawalFeePercentage: 5,
  withdrawalProcessingTime: '30 Minutes - 4 Hours'
};

export const INITIAL_WHATSAPP_SETTINGS: WhatsAppSettings = {
  channelUrl: 'https://whatsapp.com/channel/0029Vb4q1k8JUM2c67K2EARN4YOU',
  channelTitle: 'EARN4YOU Official VIP Community Channel',
  channelDescription: 'Join our verified WhatsApp Channel to receive daily task links, payment withdrawal proof receipts, emergency announcements, and live 24/7 admin assistance.',
  showChannel: true
};

export const INITIAL_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'EARN4YOU',
  tagline: 'Invest • Earn • Grow Together',
  contactEmail: 'support@earn4you.com',
  supportPhone: '+92 304 9871234',
  maintenanceMode: false,
  level1CommissionRate: 5,
  level2CommissionRate: 3,
  level3CommissionRate: 2,
  referralSystemEnabled: true,
  autoApproveTasks: true
};

export const INITIAL_ADMIN_USER: User = {
  id: 'khqFmOg0rlc4TeCbEyaGG1E3sOn2',
  name: 'Super Admin',
  email: 'syedumair56300@gmail.com',
  password: 'admin',
  role: 'admin',
  referralCode: 'E4UADMIN',
  phone: '+92 300 0000000',
  createdAt: '2026-01-01T00:00:00Z',
  status: 'active',
  accountDetails: {
    easypaisaNumber: '0304-9871234',
    jazzcashNumber: '0321-4567890',
    accountHolderName: 'EARN4YOU Admin'
  }
};

export const INITIAL_DEMO_USER: User = {
  id: 'E4U-78219',
  name: 'Syed Umair',
  email: 'user@earn4you.com',
  password: 'user123',
  role: 'user',
  referralCode: 'E4U7821',
  referredBy: 'E4UADMIN',
  phone: '+92 305 1234567',
  createdAt: '2026-10-15T12:00:00Z',
  status: 'active',
  accountDetails: {
    easypaisaNumber: '0305-1234567',
    jazzcashNumber: '0305-1234567',
    accountHolderName: 'Syed Umair'
  }
};

export const INITIAL_USER_PACKAGES: UserPackage[] = [
  {
    id: 'upkg-101',
    userId: 'E4U-78219',
    packageId: 'pkg-vip-2',
    packageName: 'VIP 2',
    price: 1000,
    dailyTaskLimit: 5,
    proposedReturnRate: 2,
    purchaseDate: '2026-11-01T10:00:00Z',
    expiryDate: '2026-12-01T10:00:00Z',
    tasksCompletedToday: 1,
    lastTaskDate: '2026-11-10',
    status: 'active'
  }
];

export const INITIAL_DEPOSITS: DepositRequest[] = [
  {
    id: 'DEP-8921',
    userId: 'E4U-78219',
    userName: 'Syed Umair',
    userEmail: 'user@earn4you.com',
    paymentMethod: 'Easypaisa',
    amount: 1500,
    transactionId: 'EP8472910398',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    createdAt: '2026-11-01T09:30:00Z',
    reviewedAt: '2026-11-01T09:45:00Z',
    reviewedBy: 'Super Admin'
  },
  {
    id: 'DEP-9042',
    userId: 'E4U-54210',
    userName: 'Hamza Khan',
    userEmail: 'hamza.k@gmail.com',
    paymentMethod: 'JazzCash',
    amount: 2500,
    transactionId: 'JC9102837461',
    screenshotUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: '2026-11-10T11:15:00Z'
  },
  {
    id: 'DEP-9043',
    userId: 'E4U-61294',
    userName: 'Ali Raza',
    userEmail: 'ali.raza@yahoo.com',
    paymentMethod: 'NayaPay',
    amount: 5000,
    transactionId: 'NP4491823700',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: '2026-11-10T12:05:00Z'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'WTH-4301',
    userId: 'E4U-78219',
    userName: 'Syed Umair',
    userEmail: 'user@earn4you.com',
    paymentMethod: 'Easypaisa',
    accountHolderName: 'Syed Umair',
    accountNumber: '0305-1234567',
    amount: 500,
    fee: 25,
    netAmount: 475,
    status: 'paid',
    createdAt: '2026-11-05T15:00:00Z',
    reviewedAt: '2026-11-05T16:30:00Z',
    paymentReference: 'PAID-EP-992182'
  },
  {
    id: 'WTH-4308',
    userId: 'E4U-78219',
    userName: 'Syed Umair',
    userEmail: 'user@earn4you.com',
    paymentMethod: 'JazzCash',
    accountHolderName: 'Syed Umair',
    accountNumber: '0305-1234567',
    amount: 350,
    fee: 17.5,
    netAmount: 332.5,
    status: 'pending',
    createdAt: '2026-11-10T10:30:00Z'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    referenceId: 'TRX-1001',
    userId: 'E4U-78219',
    type: 'deposit',
    amount: 1500,
    balanceAfter: 1500,
    date: '2026-11-01T09:45:00Z',
    status: 'completed',
    description: 'Easypaisa deposit approved (TID: EP8472910398)'
  },
  {
    id: 'tx-2',
    referenceId: 'TRX-1002',
    userId: 'E4U-78219',
    type: 'package_purchase',
    amount: -1000,
    balanceAfter: 500,
    date: '2026-11-01T10:00:00Z',
    status: 'completed',
    description: 'Purchased VIP 2 package (30 Days validity)'
  },
  {
    id: 'tx-3',
    referenceId: 'TRX-1003',
    userId: 'E4U-78219',
    type: 'task_reward',
    amount: 15,
    balanceAfter: 515,
    date: '2026-11-02T11:20:00Z',
    status: 'completed',
    description: '30s YouTube task reward: Welcome & Strategy'
  },
  {
    id: 'tx-4',
    referenceId: 'TRX-1004',
    userId: 'E4U-78219',
    type: 'referral_commission',
    amount: 50,
    balanceAfter: 565,
    date: '2026-11-03T14:10:00Z',
    status: 'completed',
    description: 'Level 1 commission from Bilal Khan VIP 2 purchase'
  },
  {
    id: 'tx-5',
    referenceId: 'TRX-1005',
    userId: 'E4U-78219',
    type: 'withdrawal',
    amount: -500,
    balanceAfter: 65,
    date: '2026-11-05T15:00:00Z',
    status: 'completed',
    description: 'Easypaisa withdrawal paid (Ref: PAID-EP-992182)'
  },
  {
    id: 'tx-6',
    referenceId: 'TRX-1006',
    userId: 'E4U-78219',
    type: 'task_reward',
    amount: 15,
    balanceAfter: 80,
    date: '2026-11-10T09:15:00Z',
    status: 'completed',
    description: '30s YouTube task reward: Channel Growth 2026'
  },
  {
    id: 'tx-7',
    referenceId: 'TRX-1007',
    userId: 'E4U-78219',
    type: 'withdrawal',
    amount: -350,
    balanceAfter: 430, // assuming previous balance had more task rewards
    date: '2026-11-10T10:30:00Z',
    status: 'pending',
    description: 'Withdrawal request submitted (JazzCash: 0305-1234567)'
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-201',
    userId: 'E4U-78219',
    userName: 'Syed Umair',
    userEmail: 'user@earn4you.com',
    subject: 'Deposit confirmation time inquiry',
    category: 'Deposit',
    status: 'answered',
    createdAt: '2026-11-01T09:35:00Z',
    updatedAt: '2026-11-01T09:42:00Z',
    messages: [
      {
        id: 'msg-1',
        senderRole: 'user',
        senderName: 'Syed Umair',
        message: 'Hello, I just sent Rs. 1500 through Easypaisa. How long will approval take?',
        timestamp: '2026-11-01T09:35:00Z'
      },
      {
        id: 'msg-2',
        senderRole: 'admin',
        senderName: 'Admin Support',
        message: 'Hello Syed! Deposits are reviewed within 15-30 minutes after verifying the TID. Your transaction was successfully approved and credited.',
        timestamp: '2026-11-01T09:42:00Z'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'E4U-ADMIN-01',
    adminName: 'Super Admin',
    action: 'APPROVE_DEPOSIT',
    details: 'Approved deposit DEP-8921 (Rs. 1,500) for user Syed Umair (TID: EP8472910398)',
    timestamp: '2026-11-01T09:45:00Z'
  },
  {
    id: 'log-2',
    adminId: 'E4U-ADMIN-01',
    adminName: 'Super Admin',
    action: 'APPROVE_WITHDRAWAL',
    details: 'Marked withdrawal WTH-4301 (Rs. 500) as PAID for Syed Umair',
    timestamp: '2026-11-05T16:30:00Z'
  },
  {
    id: 'log-3',
    adminId: 'E4U-ADMIN-01',
    adminName: 'Super Admin',
    action: 'UPDATE_SETTINGS',
    details: 'Updated WhatsApp channel link and VIP package parameters',
    timestamp: '2026-11-09T18:00:00Z'
  }
];
