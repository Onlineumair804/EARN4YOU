import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Package,
  Task,
  TaskSubmission,
  DepositRequest,
  WithdrawalRequest,
  WalletTransaction,
  UserWallet,
  PaymentSettings,
  WhatsAppSettings,
  WebsiteSettings,
  UserPackage,
  SupportTicket,
  AuditLog
} from '../types';
import {
  INITIAL_PACKAGES,
  INITIAL_TASKS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_WHATSAPP_SETTINGS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_ADMIN_USER,
  INITIAL_DEMO_USER,
  INITIAL_USER_PACKAGES,
  INITIAL_DEPOSITS,
  INITIAL_WITHDRAWALS,
  INITIAL_TRANSACTIONS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';
import { auth, database } from '../services/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, onValue, get, update } from 'firebase/database';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  packages: Package[];
  userPackages: UserPackage[];
  tasks: Task[];
  taskSubmissions: TaskSubmission[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  transactions: WalletTransaction[];
  paymentSettings: PaymentSettings;
  whatsappSettings: WhatsAppSettings;
  websiteSettings: WebsiteSettings;
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, referralCode?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  // Financial & Ledger
  getUserWallet: (userId: string) => UserWallet;
  submitDeposit: (method: 'Easypaisa' | 'JazzCash' | 'NayaPay', amount: number, trxId: string, screenshotUrl?: string) => { success: boolean; message: string };
  approveDeposit: (depositId: string) => { success: boolean; message: string };
  rejectDeposit: (depositId: string, reason: string) => { success: boolean; message: string };
  purchasePackage: (packageId: string) => { success: boolean; message: string };
  submitWithdrawal: (method: 'Easypaisa' | 'JazzCash', accountName: string, accountNum: string, amount: number) => { success: boolean; message: string };
  approveWithdrawal: (withdrawalId: string, ref?: string) => { success: boolean; message: string };
  rejectWithdrawal: (withdrawalId: string, reason: string) => { success: boolean; message: string };
  completeTask: (taskId: string, watchDuration: number) => { success: boolean; message: string };
  // Admin Operations
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  togglePackageStatus: (id: string) => void;
  deletePackage: (id: string) => { success: boolean; message: string };
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  updateWhatsAppSettings: (settings: WhatsAppSettings) => void;
  updateWebsiteSettings: (settings: WebsiteSettings) => void;
  toggleUserBlock: (userId: string) => void;
  adjustUserBalance: (userId: string, amount: number, reason: string) => void;
  createSupportTicket: (subject: string, category: any, message: string) => void;
  replySupportTicket: (ticketId: string, message: string) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadLocal = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(`earn4you_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const saveLocal = (key: string, val: any) => {
    try {
      localStorage.setItem(`earn4you_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error(e);
    }
  };

  const [users, setUsers] = useState<User[]>(() =>
    loadLocal<User[]>('users', [INITIAL_ADMIN_USER, INITIAL_DEMO_USER])
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadLocal<User | null>('currentUser', INITIAL_DEMO_USER)
  );
  const [packages, setPackages] = useState<Package[]>(() =>
    loadLocal<Package[]>('packages', INITIAL_PACKAGES)
  );
  const [userPackages, setUserPackages] = useState<UserPackage[]>(() =>
    loadLocal<UserPackage[]>('userPackages', INITIAL_USER_PACKAGES)
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadLocal<Task[]>('tasks', INITIAL_TASKS)
  );
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>(() =>
    loadLocal<TaskSubmission[]>('taskSubmissions', [
      {
        id: 'sub-1',
        taskId: 'task-1',
        taskTitle: 'Watch & Subscribe: EARN4YOU Official Welcome & Strategy',
        userId: 'E4U-78219',
        userName: 'Syed Umair',
        reward: 15,
        status: 'approved',
        completedAt: '2026-11-02T11:20:00Z',
        watchDurationSeconds: 30
      }
    ])
  );
  const [deposits, setDeposits] = useState<DepositRequest[]>(() =>
    loadLocal<DepositRequest[]>('deposits', INITIAL_DEPOSITS)
  );
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    loadLocal<WithdrawalRequest[]>('withdrawals', INITIAL_WITHDRAWALS)
  );
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() =>
    loadLocal<WalletTransaction[]>('transactions', INITIAL_TRANSACTIONS)
  );
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() =>
    loadLocal<PaymentSettings>('paymentSettings', INITIAL_PAYMENT_SETTINGS)
  );
  const [whatsappSettings, setWhatsappSettings] = useState<WhatsAppSettings>(() =>
    loadLocal<WhatsAppSettings>('whatsappSettings', INITIAL_WHATSAPP_SETTINGS)
  );
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() =>
    loadLocal<WebsiteSettings>('websiteSettings', INITIAL_WEBSITE_SETTINGS)
  );
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    loadLocal<SupportTicket[]>('supportTickets', INITIAL_SUPPORT_TICKETS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadLocal<AuditLog[]>('auditLogs', INITIAL_AUDIT_LOGS)
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sync to Firebase Realtime Database & LocalStorage
  const syncToFirebase = (path: string, data: any) => {
    saveLocal(path, data);
    try {
      const dbRef = ref(database, path);
      set(dbRef, data);
    } catch (e) {
      console.warn('Firebase sync warning:', e);
    }
  };

  useEffect(() => syncToFirebase('users', users), [users]);
  useEffect(() => syncToFirebase('currentUser', currentUser), [currentUser]);
  useEffect(() => syncToFirebase('packages', packages), [packages]);
  useEffect(() => syncToFirebase('userPackages', userPackages), [userPackages]);
  useEffect(() => syncToFirebase('tasks', tasks), [tasks]);
  useEffect(() => syncToFirebase('taskSubmissions', taskSubmissions), [taskSubmissions]);
  useEffect(() => syncToFirebase('deposits', deposits), [deposits]);
  useEffect(() => syncToFirebase('withdrawals', withdrawals), [withdrawals]);
  useEffect(() => syncToFirebase('transactions', transactions), [transactions]);
  useEffect(() => syncToFirebase('paymentSettings', paymentSettings), [paymentSettings]);
  useEffect(() => syncToFirebase('whatsappSettings', whatsappSettings), [whatsappSettings]);
  useEffect(() => syncToFirebase('websiteSettings', websiteSettings), [websiteSettings]);
  useEffect(() => syncToFirebase('supportTickets', supportTickets), [supportTickets]);
  useEffect(() => syncToFirebase('auditLogs', auditLogs), [auditLogs]);

  // Real-time synchronization from Firebase Database on mount
  useEffect(() => {
    const paths = [
      'users',
      'packages',
      'userPackages',
      'tasks',
      'taskSubmissions',
      'deposits',
      'withdrawals',
      'transactions',
      'paymentSettings',
      'whatsappSettings',
      'websiteSettings',
      'supportTickets',
      'auditLogs'
    ];

    const unsubscribers = paths.map(p => {
      const dbRef = ref(database, p);
      return onValue(
        dbRef,
        snapshot => {
          const val = snapshot.val();
          if (val) {
            if (p === 'users') setUsers(val);
            if (p === 'packages') setPackages(val);
            if (p === 'userPackages') setUserPackages(val);
            if (p === 'tasks') setTasks(val);
            if (p === 'taskSubmissions') setTaskSubmissions(val);
            if (p === 'deposits') setDeposits(val);
            if (p === 'withdrawals') setWithdrawals(val);
            if (p === 'transactions') setTransactions(val);
            if (p === 'paymentSettings') setPaymentSettings(val);
            if (p === 'whatsappSettings') setWhatsappSettings(val);
            if (p === 'websiteSettings') setWebsiteSettings(val);
            if (p === 'supportTickets') setSupportTickets(val);
            if (p === 'auditLogs') setAuditLogs(val);
          }
        },
        err => console.error('Firebase DB read error:', err)
      );
    });

    return () => {
      // Cleanup listeners
    };
  }, []);

  // Dynamic ledger calculation
  const getUserWallet = (userId: string): UserWallet => {
    const userTx = transactions.filter(t => t.userId === userId && t.status === 'completed');
    
    let balance = 0;
    let totalDeposited = 0;
    let totalPurchased = 0;
    let totalWithdrawn = 0;
    let totalTaskEarnings = 0;
    let totalReferralEarnings = 0;

    userTx.forEach(tx => {
      balance += tx.amount;
      if (tx.type === 'deposit' && tx.amount > 0) totalDeposited += tx.amount;
      if (tx.type === 'package_purchase') totalPurchased += Math.abs(tx.amount);
      if (tx.type === 'withdrawal' && tx.amount < 0) totalWithdrawn += Math.abs(tx.amount);
      if (tx.type === 'task_reward') totalTaskEarnings += tx.amount;
      if (tx.type === 'referral_commission') totalReferralEarnings += tx.amount;
    });

    const pendingWithdrawn = withdrawals
      .filter(w => w.userId === userId && (w.status === 'pending' || w.status === 'processing'))
      .reduce((sum, w) => sum + w.amount, 0);

    const pendingDep = deposits
      .filter(d => d.userId === userId && d.status === 'pending')
      .reduce((sum, d) => sum + d.amount, 0);

    const available = Math.max(0, balance);

    return {
      userId,
      availableBalance: available,
      totalDeposited,
      totalPurchased,
      totalWithdrawn,
      totalTaskEarnings,
      totalReferralEarnings,
      pendingDeposits: pendingDep,
      pendingWithdrawals: pendingWithdrawn
    };
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: currentUser?.role === 'admin' ? currentUser.id : 'SYSTEM',
      adminName: currentUser?.role === 'admin' ? currentUser.name : 'System Action',
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Functions with Firebase Auth + Realtime DB Sync
  const login = async (email: string, password?: string) => {
    try {
      const SUPER_ADMIN_UID = 'khqFmOg0rlc4TeCbEyaGG1E3sOn2';
      const SUPER_ADMIN_EMAIL = 'syedumair56300@gmail.com';

      let firebaseUserUid = '';
      if (password) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          firebaseUserUid = cred.user.uid;
        } catch (fbErr) {
          console.warn('Firebase Auth login notice:', fbErr);
        }
      }

      const isSuperAdmin =
        email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ||
        firebaseUserUid === SUPER_ADMIN_UID;

      if (isSuperAdmin) {
        const adminUser: User = {
          id: SUPER_ADMIN_UID,
          name: 'Super Admin',
          email: SUPER_ADMIN_EMAIL,
          role: 'admin',
          referralCode: 'E4UADMIN',
          createdAt: '2026-01-01T00:00:00Z',
          status: 'active',
          accountDetails: {
            easypaisaNumber: '0304-9871234',
            jazzcashNumber: '0321-4567890',
            accountHolderName: 'EARN4YOU Admin'
          }
        };
        setCurrentUser(adminUser);
        return { success: true, message: 'Welcome back, Super Admin!' };
      }

      // Normal user authentication
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        return { success: false, message: 'No account registered with this email address.' };
      }
      if (found.status === 'blocked') {
        return { success: false, message: 'Your account has been suspended by administration.' };
      }
      if (password && found.password && found.password !== password) {
        return { success: false, message: 'Incorrect password entered.' };
      }

      // Ensure normal users never receive admin role
      const normalUser: User = {
        ...found,
        role: 'user'
      };

      setCurrentUser(normalUser);
      return { success: true, message: `Welcome back, ${normalUser.name}!` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Authentication error occurred.' };
    }
  };

  const register = async (name: string, email: string, password: string, referralCode?: string) => {
    try {
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      // Create in Firebase Auth
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (fbErr) {
        console.warn('Firebase Auth register warning:', fbErr);
      }

      let referredByCode: string | undefined = undefined;
      if (referralCode && referralCode.trim() !== '') {
        const inviter = users.find(u => u.referralCode.toUpperCase() === referralCode.trim().toUpperCase());
        if (inviter) {
          referredByCode = inviter.referralCode;
        }
      }

      const uniqueNum = Math.floor(10000 + Math.random() * 90000);
      const newUser: User = {
        id: `E4U-${uniqueNum}`,
        name,
        email,
        password,
        role: 'user',
        referralCode: `E4U${uniqueNum.toString().slice(0, 4)}`,
        referredBy: referredByCode,
        createdAt: new Date().toISOString(),
        status: 'active',
        accountDetails: {
          easypaisaNumber: '',
          jazzcashNumber: '',
          accountHolderName: name
        }
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true, message: 'Account registered successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error occurred.' };
    }
  };

  const logout = () => {
    try {
      fbSignOut(auth);
    } catch {}
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  // Financial Deposit Flow
  const submitDeposit = (method: 'Easypaisa' | 'JazzCash' | 'NayaPay', amount: number, trxId: string, screenshotUrl?: string) => {
    if (!currentUser) return { success: false, message: 'Please log in to submit a deposit.' };
    if (currentUser.status === 'blocked') return { success: false, message: 'Account is blocked.' };

    if (amount < paymentSettings.minDeposit) {
      return { success: false, message: `Minimum deposit amount is Rs. ${paymentSettings.minDeposit}` };
    }
    if (amount > paymentSettings.maxDeposit) {
      return { success: false, message: `Maximum deposit limit is Rs. ${paymentSettings.maxDeposit}` };
    }

    const isDuplicate = deposits.some(d => d.transactionId.trim().toUpperCase() === trxId.trim().toUpperCase());
    if (isDuplicate) {
      return { success: false, message: 'This Transaction ID (TID) has already been submitted or processed!' };
    }

    const newDeposit: DepositRequest = {
      id: `DEP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      paymentMethod: method,
      amount,
      transactionId: trxId.trim().toUpperCase(),
      screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setDeposits(prev => [newDeposit, ...prev]);
    return { success: true, message: 'Deposit request submitted successfully! Admin will verify and credit your wallet shortly.' };
  };

  const approveDeposit = (depositId: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') {
      return { success: false, message: 'Deposit request not found or already processed.' };
    }

    setDeposits(prev =>
      prev.map(d =>
        d.id === depositId
          ? {
              ...d,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Admin'
            }
          : d
      )
    );

    const wallet = getUserWallet(deposit.userId);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      referenceId: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: deposit.userId,
      type: 'deposit',
      amount: deposit.amount,
      balanceAfter: wallet.availableBalance + deposit.amount,
      date: new Date().toISOString(),
      status: 'completed',
      description: `${deposit.paymentMethod} Deposit Approved (TID: ${deposit.transactionId})`
    };

    setTransactions(prev => [newTx, ...prev]);
    addAuditLog('APPROVE_DEPOSIT', `Approved deposit ${deposit.id} (Rs. ${deposit.amount}) for user ${deposit.userName} (TID: ${deposit.transactionId})`);

    return { success: true, message: `Deposit of Rs. ${deposit.amount} approved and credited to ${deposit.userName}!` };
  };

  const rejectDeposit = (depositId: string, reason: string) => {
    const deposit = deposits.find(d => d.id === depositId);
    if (!deposit || deposit.status !== 'pending') {
      return { success: false, message: 'Deposit not found or already processed.' };
    }

    setDeposits(prev =>
      prev.map(d =>
        d.id === depositId
          ? {
              ...d,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser?.name || 'Admin',
              rejectionReason: reason || 'Invalid Transaction ID or unverified receipt'
            }
          : d
      )
    );

    addAuditLog('REJECT_DEPOSIT', `Rejected deposit ${deposit.id} for user ${deposit.userName}. Reason: ${reason}`);
    return { success: true, message: 'Deposit request marked as rejected.' };
  };

  // Manual Package Purchase Flow
  const purchasePackage = (packageId: string) => {
    if (!currentUser) return { success: false, message: 'Please log in to purchase a package.' };
    if (currentUser.status === 'blocked') return { success: false, message: 'Account is blocked.' };

    const pkg = packages.find(p => p.id === packageId);
    if (!pkg || pkg.status !== 'active') {
      return { success: false, message: 'Selected package is currently inactive or unavailable.' };
    }

    const wallet = getUserWallet(currentUser.id);
    if (wallet.availableBalance < pkg.price) {
      return {
        success: false,
        message: `Insufficient balance! Package price is Rs. ${pkg.price.toLocaleString()}, but your available balance is Rs. ${wallet.availableBalance.toLocaleString()}. Please deposit funds first.`
      };
    }

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      referenceId: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      type: 'package_purchase',
      amount: -pkg.price,
      balanceAfter: wallet.availableBalance - pkg.price,
      date: new Date().toISOString(),
      status: 'completed',
      description: `Purchased ${pkg.name} Package (${pkg.durationDays} Days, ${pkg.dailyTaskLimit} Daily Tasks)`
    };

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + pkg.durationDays * 24 * 60 * 60 * 1000).toISOString();
    const newUserPackage: UserPackage = {
      id: `upkg-${Date.now()}`,
      userId: currentUser.id,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      dailyTaskLimit: pkg.dailyTaskLimit,
      proposedReturnRate: pkg.proposedReturnRate,
      purchaseDate: new Date().toISOString(),
      expiryDate: expiry,
      tasksCompletedToday: 0,
      lastTaskDate: today,
      status: 'active'
    };

    setTransactions(prev => [newTx, ...prev]);
    setUserPackages(prev => [newUserPackage, ...prev]);

    // 3-LEVEL REFERRAL COMMISSION TRIGGER
    if (websiteSettings.referralSystemEnabled && currentUser.referredBy) {
      const level1User = users.find(u => u.referralCode === currentUser.referredBy);
      if (level1User && level1User.id !== currentUser.id) {
        const comm1 = (pkg.price * websiteSettings.level1CommissionRate) / 100;
        const l1Wallet = getUserWallet(level1User.id);
        const l1Tx: WalletTransaction = {
          id: `tx-ref1-${Date.now()}`,
          referenceId: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
          userId: level1User.id,
          type: 'referral_commission',
          amount: comm1,
          balanceAfter: l1Wallet.availableBalance + comm1,
          date: new Date().toISOString(),
          status: 'completed',
          description: `Level 1 Commission (5%): ${currentUser.name} purchased ${pkg.name}`
        };
        setTransactions(prev => [l1Tx, ...prev]);

        if (level1User.referredBy) {
          const level2User = users.find(u => u.referralCode === level1User.referredBy);
          if (level2User && level2User.id !== currentUser.id && level2User.id !== level1User.id) {
            const comm2 = (pkg.price * websiteSettings.level2CommissionRate) / 100;
            const l2Wallet = getUserWallet(level2User.id);
            const l2Tx: WalletTransaction = {
              id: `tx-ref2-${Date.now()}`,
              referenceId: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
              userId: level2User.id,
              type: 'referral_commission',
              amount: comm2,
              balanceAfter: l2Wallet.availableBalance + comm2,
              date: new Date().toISOString(),
              status: 'completed',
              description: `Level 2 Commission (3%): ${currentUser.name} purchased ${pkg.name}`
            };
            setTransactions(prev => [l2Tx, ...prev]);

            if (level2User.referredBy) {
              const level3User = users.find(u => u.referralCode === level2User.referredBy);
              if (level3User && level3User.id !== currentUser.id && level3User.id !== level1User.id && level3User.id !== level2User.id) {
                const comm3 = (pkg.price * websiteSettings.level3CommissionRate) / 100;
                const l3Wallet = getUserWallet(level3User.id);
                const l3Tx: WalletTransaction = {
                  id: `tx-ref3-${Date.now()}`,
                  referenceId: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
                  userId: level3User.id,
                  type: 'referral_commission',
                  amount: comm3,
                  balanceAfter: l3Wallet.availableBalance + comm3,
                  date: new Date().toISOString(),
                  status: 'completed',
                  description: `Level 3 Commission (2%): ${currentUser.name} purchased ${pkg.name}`
                };
                setTransactions(prev => [l3Tx, ...prev]);
              }
            }
          }
        }
      }
    }

    addAuditLog('PACKAGE_PURCHASE', `User ${currentUser.name} (${currentUser.id}) purchased ${pkg.name} for Rs. ${pkg.price}`);
    return { success: true, message: `Congratulations! ${pkg.name} package activated successfully. Daily task quota enabled!` };
  };

  // Withdrawal Flow
  const submitWithdrawal = (method: 'Easypaisa' | 'JazzCash', accountName: string, accountNum: string, amount: number) => {
    if (!currentUser) return { success: false, message: 'Please log in to withdraw funds.' };
    if (currentUser.status === 'blocked') return { success: false, message: 'Account is blocked.' };

    const wallet = getUserWallet(currentUser.id);
    if (amount < paymentSettings.minWithdrawal) {
      return { success: false, message: `Minimum withdrawal is Rs. ${paymentSettings.minWithdrawal}` };
    }
    if (amount > paymentSettings.maxWithdrawal) {
      return { success: false, message: `Maximum withdrawal limit is Rs. ${paymentSettings.maxWithdrawal}` };
    }
    if (wallet.availableBalance < amount) {
      return { success: false, message: `Insufficient balance! Available: Rs. ${wallet.availableBalance.toLocaleString()}` };
    }

    const fee = (amount * paymentSettings.withdrawalFeePercentage) / 100;
    const net = amount - fee;

    const newWth: WithdrawalRequest = {
      id: `WTH-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      paymentMethod: method,
      accountHolderName: accountName,
      accountNumber: accountNum,
      amount,
      fee,
      netAmount: net,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      referenceId: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      type: 'withdrawal',
      amount: -amount,
      balanceAfter: wallet.availableBalance - amount,
      date: new Date().toISOString(),
      status: 'pending',
      description: `Withdrawal request submitted (${method}: ${accountNum})`
    };

    setWithdrawals(prev => [newWth, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `Withdrawal request for Rs. ${amount.toLocaleString()} submitted! Processing time: ${paymentSettings.withdrawalProcessingTime}.` };
  };

  const approveWithdrawal = (withdrawalId: string, ref?: string) => {
    const wth = withdrawals.find(w => w.id === withdrawalId);
    if (!wth || (wth.status !== 'pending' && wth.status !== 'processing')) {
      return { success: false, message: 'Withdrawal not found or already completed.' };
    }

    setWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'paid',
              reviewedAt: new Date().toISOString(),
              paymentReference: ref || `PAID-${w.paymentMethod.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
            }
          : w
      )
    );

    setTransactions(prev =>
      prev.map(t =>
        t.userId === wth.userId && t.type === 'withdrawal' && t.status === 'pending' && Math.abs(t.amount) === wth.amount
          ? { ...t, status: 'completed' }
          : t
      )
    );

    addAuditLog('PAID_WITHDRAWAL', `Marked withdrawal ${wth.id} (Rs. ${wth.amount}) as PAID to ${wth.userName} (${wth.paymentMethod})`);
    return { success: true, message: `Withdrawal of Rs. ${wth.amount} marked as PAID!` };
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    const wth = withdrawals.find(w => w.id === withdrawalId);
    if (!wth || (wth.status !== 'pending' && wth.status !== 'processing')) {
      return { success: false, message: 'Withdrawal not found or already finalized.' };
    }

    setWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason || 'Invalid account details or network error'
            }
          : w
      )
    );

    const wallet = getUserWallet(wth.userId);
    const refundTx: WalletTransaction = {
      id: `tx-ref-${Date.now()}`,
      referenceId: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: wth.userId,
      type: 'withdrawal_refund',
      amount: wth.amount,
      balanceAfter: wallet.availableBalance + wth.amount,
      date: new Date().toISOString(),
      status: 'completed',
      description: `Refund for rejected withdrawal ${wth.id}: ${reason}`
    };

    setTransactions(prev => [refundTx, ...prev]);
    addAuditLog('REJECT_WITHDRAWAL', `Rejected withdrawal ${wth.id} for user ${wth.userName}. Funds refunded.`);
    return { success: true, message: `Withdrawal rejected and Rs. ${wth.amount} refunded to user wallet.` };
  };

  // 30-Second YouTube Task Management & Completion
  const completeTask = (taskId: string, watchDuration: number) => {
    if (!currentUser) return { success: false, message: 'Please log in to complete tasks.' };
    if (currentUser.status === 'blocked') return { success: false, message: 'Account is blocked.' };

    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: 'Task not found.' };

    const today = new Date().toISOString().split('T')[0];
    const activePackages = userPackages.filter(
      p => p.userId === currentUser.id && p.status === 'active' && new Date(p.expiryDate) > new Date()
    );

    if (activePackages.length === 0) {
      return {
        success: false,
        message: 'No active VIP package found! Please purchase an investment package to unlock daily task limits.'
      };
    }

    const totalDailyTaskLimit = activePackages.reduce((sum, p) => sum + p.dailyTaskLimit, 0);
    const completedToday = taskSubmissions.filter(
      s => s.userId === currentUser.id && s.completedAt.startsWith(today)
    ).length;

    if (completedToday >= totalDailyTaskLimit) {
      return {
        success: false,
        message: `Daily task limit reached (${completedToday}/${totalDailyTaskLimit}) for your VIP tier!`
      };
    }

    if (watchDuration < 28) {
      return {
        success: false,
        message: `Task verification failed: You watched for only ${watchDuration} seconds. Minimum 30 seconds required!`
      };
    }

    const alreadyDoneToday = taskSubmissions.some(
      s => s.userId === currentUser.id && s.taskId === taskId && s.completedAt.startsWith(today)
    );
    if (alreadyDoneToday) {
      return {
        success: false,
        message: 'You have already completed this specific task today.'
      };
    }

    const newSub: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      userId: currentUser.id,
      userName: currentUser.name,
      reward: task.reward,
      status: 'approved',
      completedAt: new Date().toISOString(),
      watchDurationSeconds: watchDuration
    };

    const wallet = getUserWallet(currentUser.id);
    const rewardTx: WalletTransaction = {
      id: `tx-tsk-${Date.now()}`,
      referenceId: `TSK-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      type: 'task_reward',
      amount: task.reward,
      balanceAfter: wallet.availableBalance + task.reward,
      date: new Date().toISOString(),
      status: 'completed',
      description: `30s YouTube Task Reward: ${task.title.slice(0, 30)}...`
    };

    setTaskSubmissions(prev => [newSub, ...prev]);
    setTransactions(prev => [rewardTx, ...prev]);

    setUserPackages(prev =>
      prev.map(p => {
        if (p.userId === currentUser.id && p.status === 'active') {
          return {
            ...p,
            tasksCompletedToday: (p.lastTaskDate === today ? p.tasksCompletedToday : 0) + 1,
            lastTaskDate: today
          };
        }
        return p;
      })
    );

    return {
      success: true,
      message: `Awesome! You earned Rs. ${task.reward} for completing 30-second YouTube task! Wallet credited.`
    };
  };

  // Admin Operations
  const addPackage = (pkg: Omit<Package, 'id'>) => {
    const newPkg: Package = {
      ...pkg,
      id: `pkg-${Date.now()}`
    };
    setPackages(prev => [...prev, newPkg]);
    addAuditLog('ADD_PACKAGE', `Created package ${newPkg.name} (Rs. ${newPkg.price})`);
  };

  const updatePackage = (id: string, pkgData: Partial<Package>) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, ...pkgData } : p));
    addAuditLog('UPDATE_PACKAGE', `Updated package details for ${id}`);
  };

  const togglePackageStatus = (id: string) => {
    setPackages(prev =>
      prev.map(p => (p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p))
    );
  };

  const deletePackage = (id: string) => {
    const hasPurchased = userPackages.some(up => up.packageId === id);
    if (hasPurchased) {
      return { success: false, message: 'Cannot delete package because historical user purchases exist. Set status to Inactive instead.' };
    }
    setPackages(prev => prev.filter(p => p.id !== id));
    addAuditLog('DELETE_PACKAGE', `Deleted package ${id}`);
    return { success: true, message: 'Package deleted successfully.' };
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    addAuditLog('ADD_TASK', `Created YouTube task: ${newTask.title}`);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...taskData } : t));
    addAuditLog('UPDATE_TASK', `Updated task ${id}`);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addAuditLog('DELETE_TASK', `Deleted task ${id}`);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t))
    );
  };

  const updatePaymentSettings = (settings: PaymentSettings) => {
    setPaymentSettings(settings);
    addAuditLog('UPDATE_PAYMENT_SETTINGS', 'Updated payment accounts and withdrawal parameters');
  };

  const updateWhatsAppSettings = (settings: WhatsAppSettings) => {
    setWhatsappSettings(settings);
    addAuditLog('UPDATE_WHATSAPP', `Updated WhatsApp channel URL: ${settings.channelUrl}`);
  };

  const updateWebsiteSettings = (settings: WebsiteSettings) => {
    setWebsiteSettings(settings);
    addAuditLog('UPDATE_WEBSITE_SETTINGS', 'Updated platform core configurations');
  };

  const toggleUserBlock = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'blocked' : 'active';
          addAuditLog('TOGGLE_USER_STATUS', `${newStatus === 'blocked' ? 'Blocked' : 'Unblocked'} user ${u.name} (${u.id})`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const adjustUserBalance = (userId: string, amount: number, reason: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const wallet = getUserWallet(userId);
    const newTx: WalletTransaction = {
      id: `tx-adj-${Date.now()}`,
      referenceId: `ADJ-${Math.floor(10000 + Math.random() * 90000)}`,
      userId,
      type: 'admin_adjustment',
      amount,
      balanceAfter: wallet.availableBalance + amount,
      date: new Date().toISOString(),
      status: 'completed',
      description: `Admin balance adjustment: ${reason}`
    };
    setTransactions(prev => [newTx, ...prev]);
    addAuditLog('ADJUST_BALANCE', `Adjusted balance for ${target.name} by Rs. ${amount}. Reason: ${reason}`);
  };

  const createSupportTicket = (subject: string, category: any, message: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      subject,
      category,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'user',
          senderName: currentUser.name,
          message,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    const isAdm = currentUser?.role === 'admin';
    setSupportTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: isAdm ? 'answered' : 'open',
            updatedAt: new Date().toISOString(),
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                senderRole: isAdm ? 'admin' : 'user',
                senderName: currentUser?.name || 'Support',
                message,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const resetAllDataToDefault = () => {
    localStorage.clear();
    setUsers([INITIAL_ADMIN_USER, INITIAL_DEMO_USER]);
    setCurrentUser(INITIAL_DEMO_USER);
    setPackages(INITIAL_PACKAGES);
    setUserPackages(INITIAL_USER_PACKAGES);
    setTasks(INITIAL_TASKS);
    setDeposits(INITIAL_DEPOSITS);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setTransactions(INITIAL_TRANSACTIONS);
    setPaymentSettings(INITIAL_PAYMENT_SETTINGS);
    setWhatsappSettings(INITIAL_WHATSAPP_SETTINGS);
    setWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        packages,
        userPackages,
        tasks,
        taskSubmissions,
        deposits,
        withdrawals,
        transactions,
        paymentSettings,
        whatsappSettings,
        websiteSettings,
        supportTickets,
        auditLogs,
        activeTab,
        setActiveTab,
        login,
        register,
        logout,
        updateProfile,
        getUserWallet,
        submitDeposit,
        approveDeposit,
        rejectDeposit,
        purchasePackage,
        submitWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        completeTask,
        addPackage,
        updatePackage,
        togglePackageStatus,
        deletePackage,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        updatePaymentSettings,
        updateWhatsAppSettings,
        updateWebsiteSettings,
        toggleUserBlock,
        adjustUserBalance,
        createSupportTicket,
        replySupportTicket,
        resetAllDataToDefault
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
