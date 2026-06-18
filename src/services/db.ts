/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CloudEnvironment,
  PerformanceMetric,
  SecurityRisk,
  CustomResourceNode,
  ActivityLog,
  SystemNotification,
  RegisteredUser,
  CloudProvider
} from '../types';

// Seed initial registered users
const DEFAULT_USERS: RegisteredUser[] = [
  {
    uid: 'user-1',
    email: 'rakesh.pandey@gmail.com',
    displayName: 'Rakesh Pandey',
    role: 'Admin',
    institution: 'MCA Department, Uttaranchal University',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    uid: 'user-2',
    email: 'academic.advisor@mca.edu',
    displayName: 'Academic Supervisor',
    role: 'Researcher',
    institution: 'School of Cloud Computing & Security',
    createdAt: '2026-02-15T11:30:00Z',
  },
  {
    uid: 'user-3',
    email: 'student.evaluator@univ.edu',
    displayName: 'External Examiner',
    role: 'Student',
    institution: 'University Board of Examinations',
    createdAt: '2026-03-01T09:12:00Z',
  }
];

// Seed initial cloud environments
const DEFAULT_ENVIRONMENTS: CloudEnvironment[] = [
  {
    id: 'env-aws-1',
    name: 'AWS Primary Compute Block',
    provider: 'aws',
    region: 'us-east-1 (N. Virginia)',
    isActive: true,
    serverCount: 4,
    instanceType: 't3.xlarge (4 vCPU, 16GB RAM)',
    dbType: 'Amazon RDS PostgreSQL',
    securityScore: 82,
    encryptionEnabled: true,
    firewallRules: 12,
    costPerHour: 0.68,
  },
  {
    id: 'env-azure-1',
    name: 'Azure Regional DB Sync',
    provider: 'azure',
    region: 'westeurope (Amsterdam)',
    isActive: true,
    serverCount: 3,
    instanceType: 'Standard_D4s_v5 (4 vCPU, 16GB RAM)',
    dbType: 'Azure SQL Database',
    securityScore: 68,
    encryptionEnabled: false,
    firewallRules: 8,
    costPerHour: 0.72,
  },
  {
    id: 'env-gcp-1',
    name: 'GKE Analytical Cluster',
    provider: 'gcp',
    region: 'asia-east1 (Taiwan)',
    isActive: true,
    serverCount: 5,
    instanceType: 'e2-standard-4 (4 vCPU, 16GB RAM)',
    dbType: 'Google Cloud Spanner',
    securityScore: 91,
    encryptionEnabled: true,
    firewallRules: 15,
    costPerHour: 0.78,
  },
];

// Seed 15 historical telemetry entries
const generateInitialTelemetry = (): PerformanceMetric[] => {
  const data: PerformanceMetric[] = [];
  const now = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Simulating standard performance spikes and regional variations
    const awsLat = Math.round(52 + Math.sin(i * 0.8) * 8 + Math.random() * 4);
    const azureLat = Math.round(64 + Math.cos(i * 0.6) * 11 + Math.random() * 5);
    const gcpLat = Math.round(38 + Math.sin(i * 0.5) * 6 + Math.random() * 3);
    
    // Multi-Cloud load balanced setup is overall faster and significantly more stable than any single node (due to Global High Availability CDN caching)
    const multiLat = Math.round(31 + Math.sin(i * 0.4) * 3 + Math.random() * 2);
    
    const awsTp = Math.round(420 + Math.cos(i * 0.4) * 35 + Math.random() * 15);
    const azureTp = Math.round(380 + Math.sin(i * 0.7) * 40 + Math.random() * 20);
    const gcpTp = Math.round(460 + Math.cos(i * 0.5) * 50 + Math.random() * 10);
    
    // Combined throughput is high with minimal standard deviation
    const multiTp = Math.round(1120 + Math.sin(i * 0.3) * 80 + Math.random() * 30);
    
    data.push({
      timestamp: timeString,
      awsLatency: awsLat,
      awsThroughput: awsTp,
      azureLatency: azureLat,
      azureThroughput: azureTp,
      gcpLatency: gcpLat,
      gcpThroughput: gcpTp,
      multiCloudLatency: multiLat,
      multiCloudThroughput: multiTp,
    });
  }
  return data;
};

// Seed initial Security Risks
const DEFAULT_RISKS: SecurityRisk[] = [
  {
    id: 'risk-1',
    title: 'S3 Unencrypted Object Storage Directory',
    severity: 'HIGH',
    provider: 'aws',
    category: 'Encryption',
    status: 'VULNERABLE',
    description: 'Object storage directory exhibits unencrypted master volume variables, rendering standard backup blocks vulnerable to metadata harvesting.',
    remediation: 'Configure AWS KMS with managed keys and enable DEFAULT AWS managed server-side S3 encryption (SSE-S3).',
  },
  {
    id: 'risk-2',
    title: 'Azure Admin Database Firewall Ports Exposed (0.0.0.0/0)',
    severity: 'CRITICAL',
    provider: 'azure',
    category: 'Access Control',
    status: 'VULNERABLE',
    description: 'Firewall rules permit unrestricted database block connectivity from all external client addresses on server port 1433.',
    remediation: 'Apply Azure Virtual Network private endpoints and restrict administrative firewalls strictly to designated office CIDR blocks.',
  },
  {
    id: 'risk-3',
    title: 'GCP Kubernetes Node Service Account Privilege Escalation',
    severity: 'MEDIUM',
    provider: 'gcp',
    category: 'Configuration',
    status: 'RESTRICTED',
    description: 'GKE Nodes represent standard compute-engine access profiles capable of requesting full cloud platform API access scopes.',
    remediation: 'Restrict default Compute service node account permissions and implement GCP Workload Identity federation policies.',
  },
  {
    id: 'risk-4',
    title: 'Unsecured Public Endpoints without TLS 1.3 Strict Enforcement',
    severity: 'MEDIUM',
    provider: 'hybrid',
    category: 'Network',
    status: 'VULNERABLE',
    description: 'Global Load Balancer configuration permits transport negotiation utilizing outdated TLS 1.0/1.1 protocols.',
    remediation: 'Configure SSL Policy profiles to mandate TLS 1.2 minimum / TLS 1.3 strict enforcement across load balanced gateways.',
  },
  {
    id: 'risk-5',
    title: 'Azure Active Directory Multi-Factor Authentication (MFA) Bypass',
    severity: 'CRITICAL',
    provider: 'azure',
    category: 'Access Control',
    status: 'VULNERABLE',
    description: 'Administrative root accounts bypass conditional access controls, permitting simple console password authentication without MFA prompts.',
    remediation: 'Enforce Entra ID conditional access policy requiring hardware token MFA authentication on administrative accounts.',
  }
];

// Seed initial Resource Nodes
const generateInitialResources = (): CustomResourceNode[] => {
  return [
    { id: 'res-aws-1', name: 'aws-ec2-web-01', envId: 'env-aws-1', provider: 'aws', type: 'compute', status: 'running', cpuUtilization: 42, ramUtilization: 61, diskUtilization: 38 },
    { id: 'res-aws-2', name: 'aws-ec2-web-02', envId: 'env-aws-1', provider: 'aws', type: 'compute', status: 'running', cpuUtilization: 34, ramUtilization: 58, diskUtilization: 38 },
    { id: 'res-aws-3', name: 'aws-rds-postgres', envId: 'env-aws-1', provider: 'aws', type: 'database', status: 'running', cpuUtilization: 18, ramUtilization: 44, diskUtilization: 52 },
    { id: 'res-aws-4', name: 'aws-s3-media-bucket', envId: 'env-aws-1', provider: 'aws', type: 'storage', status: 'running', cpuUtilization: 5, ramUtilization: 10, diskUtilization: 74 },
    
    { id: 'res-azure-1', name: 'azure-vm-app-01', envId: 'env-azure-1', provider: 'azure', type: 'compute', status: 'running', cpuUtilization: 58, ramUtilization: 72, diskUtilization: 45 },
    { id: 'res-azure-2', name: 'azure-vm-app-02', envId: 'env-azure-1', provider: 'azure', type: 'compute', status: 'stopped', cpuUtilization: 0, ramUtilization: 0, diskUtilization: 45 },
    { id: 'res-azure-3', name: 'azure-sql-primary', envId: 'env-azure-1', provider: 'azure', type: 'database', status: 'running', cpuUtilization: 31, ramUtilization: 68, diskUtilization: 62 },
    
    { id: 'res-gcp-1', name: 'gcp-gke-pod-01', envId: 'env-gcp-1', provider: 'gcp', type: 'compute', status: 'running', cpuUtilization: 22, ramUtilization: 50, diskUtilization: 24 },
    { id: 'res-gcp-2', name: 'gcp-gke-pod-02', envId: 'env-gcp-1', provider: 'gcp', type: 'compute', status: 'running', cpuUtilization: 29, ramUtilization: 52, diskUtilization: 24 },
    { id: 'res-gcp-3', name: 'gcp-spanner-node', envId: 'env-gcp-1', provider: 'gcp', type: 'database', status: 'running', cpuUtilization: 14, ramUtilization: 30, diskUtilization: 19 },
    { id: 'res-gcp-4', name: 'gcp-cdn-assets', envId: 'env-gcp-1', provider: 'gcp', type: 'cdn', status: 'running', cpuUtilization: 8, ramUtilization: 15, diskUtilization: 12 },
  ];
};

// Seed System Logs
const generateInitialLogs = (): ActivityLog[] => {
  return [
    { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), userId: 'system', userEmail: 'scheduler@telemetry.io', action: 'Multi-cloud telemetry simulator polling started.', category: 'performance', status: 'success' },
    { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), userId: 'user-1', userEmail: 'vivekfalkoti11@gmail.com', action: 'Database security credentials verified with AWS IAM policies.', category: 'security', provider: 'aws', status: 'success' },
    { id: 'log-3', timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), userId: 'user-2', userEmail: 'academic.advisor@mca.edu', action: 'Downloaded Chapter 6 Research Notes on multi-provider failovers.', category: 'study', status: 'success' },
    { id: 'log-4', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), userId: 'user-1', userEmail: 'vivekfalkoti11@gmail.com', action: 'Stopped AZURE secondary core database app cluster instance.', category: 'resource', provider: 'azure', status: 'warning' },
    { id: 'log-5', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), userId: 'system', userEmail: 'scanner@sec-drifter.net', action: 'Discovered missing Encryption configuration on Azure VM volumes.', category: 'security', provider: 'azure', status: 'warning' },
  ];
};

// Seed default Notifications
const generateInitialNotifications = (): SystemNotification[] => {
  return [
    { id: 'not-1', title: 'Critical Alert', message: 'Azure DB firewall exposes public connection ports.', type: 'alert', timestamp: '10 min ago', read: false },
    { id: 'not-2', title: 'Performance Spike', message: 'AWS Compute cluster experienced standard workload increases (+15% latency increase).', type: 'warning', timestamp: '45 min ago', read: false },
    { id: 'not-3', title: 'Security Standard Checked', message: 'GCP cluster verified with PCI-DSS compliance audits successfully.', type: 'success', timestamp: '2 hours ago', read: true },
  ];
};

class CloudPlatformDatabase {
  private users: RegisteredUser[] = [];
  private environments: CloudEnvironment[] = [];
  private telemetry: PerformanceMetric[] = [];
  private risks: SecurityRisk[] = [];
  private resources: CustomResourceNode[] = [];
  private logs: ActivityLog[] = [];
  private notifications: SystemNotification[] = [];
  
  // Auth state
  private currentUser: RegisteredUser | null = null;
  
  // Custom load balancer algorithm
  private lbAlgorithm: 'round-robin' | 'latency' | 'failover' = 'latency';
  
  // Listeners list for components to subscribe to changes
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
    
    // Periodically update telemetry parameters (every 10 seconds) to simulate true server monitoring
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.tickTelemetry();
      }, 10000);
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const storedUsers = localStorage.getItem('mca_cloud_users');
      let loadedUsers: RegisteredUser[] = storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
      loadedUsers = loadedUsers.map(u => ({
        ...u,
        institution: u.institution.replace(/National Institute of Technology/g, 'Uttaranchal University'),
        displayName: u.displayName === 'Vivek Falkoti' ? 'Rakesh Pandey' : (u.displayName === 'Dr. Ramesh Sharma' ? 'Academic Supervisor' : u.displayName),
        email: u.email === 'vivekfalkoti11@gmail.com' ? 'rakesh.pandey@gmail.com' : u.email
      }));
      this.users = loadedUsers;

      const storedEnvs = localStorage.getItem('mca_cloud_envs');
      this.environments = storedEnvs ? JSON.parse(storedEnvs) : DEFAULT_ENVIRONMENTS;

      const storedTelemetry = localStorage.getItem('mca_cloud_telemetry');
      this.telemetry = storedTelemetry ? JSON.parse(storedTelemetry) : generateInitialTelemetry();

      const storedRisks = localStorage.getItem('mca_cloud_risks');
      this.risks = storedRisks ? JSON.parse(storedRisks) : DEFAULT_RISKS;

      const storedResources = localStorage.getItem('mca_cloud_resources');
      this.resources = storedResources ? JSON.parse(storedResources) : generateInitialResources();

      const storedLogs = localStorage.getItem('mca_cloud_logs');
      this.logs = storedLogs ? JSON.parse(storedLogs) : generateInitialLogs();

      const storedNotifs = localStorage.getItem('mca_cloud_notifications');
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : generateInitialNotifications();

      const storedAuth = localStorage.getItem('mca_cloud_current_auth');
      let loadedAuth: RegisteredUser | null = storedAuth ? JSON.parse(storedAuth) : null;
      if (loadedAuth) {
        loadedAuth = {
          ...loadedAuth,
          institution: loadedAuth.institution.replace(/National Institute of Technology/g, 'Uttaranchal University'),
          displayName: loadedAuth.displayName === 'Vivek Falkoti' ? 'Rakesh Pandey' : (loadedAuth.displayName === 'Dr. Ramesh Sharma' ? 'Academic Supervisor' : loadedAuth.displayName),
          email: loadedAuth.email === 'vivekfalkoti11@gmail.com' ? 'rakesh.pandey@gmail.com' : loadedAuth.email
        };
      }
      this.currentUser = loadedAuth || this.users[0]; // Log in as Rakesh by default for instant evaluation
      
      // Save changes immediately if we did a migration on active storage items
      this.saveToStorage();

      const storedLb = localStorage.getItem('mca_cloud_lb_algo');
      this.lbAlgorithm = (storedLb as any) || 'latency';
    } catch (e) {
      console.error('Failed to load DB state in local storage', e);
      this.users = DEFAULT_USERS;
      this.environments = DEFAULT_ENVIRONMENTS;
      this.telemetry = generateInitialTelemetry();
      this.risks = DEFAULT_RISKS;
      this.resources = generateInitialResources();
      this.logs = generateInitialLogs();
      this.notifications = generateInitialNotifications();
      this.currentUser = DEFAULT_USERS[0];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('mca_cloud_users', JSON.stringify(this.users));
      localStorage.setItem('mca_cloud_envs', JSON.stringify(this.environments));
      localStorage.setItem('mca_cloud_telemetry', JSON.stringify(this.telemetry));
      localStorage.setItem('mca_cloud_risks', JSON.stringify(this.risks));
      localStorage.setItem('mca_cloud_resources', JSON.stringify(this.resources));
      localStorage.setItem('mca_cloud_logs', JSON.stringify(this.logs));
      localStorage.setItem('mca_cloud_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('mca_cloud_current_auth', JSON.stringify(this.currentUser));
      localStorage.setItem('mca_cloud_lb_algo', this.lbAlgorithm);
    } catch (e) {
      console.error('Failed to write DB state in local storage', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach(listener => listener());
  }

  // Telemetry tick execution
  private tickTelemetry() {
    const lastPoint = this.telemetry[this.telemetry.length - 1];
    if (!lastPoint) return;
    
    const time = new Date();
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Simulate minor variations
    const awsLat = Math.max(30, Math.round(lastPoint.awsLatency + (Math.random() * 6 - 3)));
    const azureLat = Math.max(40, Math.round(lastPoint.azureLatency + (Math.random() * 8 - 4)));
    const gcpLat = Math.max(25, Math.round(lastPoint.gcpLatency + (Math.random() * 5 - 2.5)));
    
    const multiLat = Math.max(20, Math.round(lastPoint.multiCloudLatency + (Math.random() * 4 - 2)));
    
    const awsTp = Math.max(300, Math.round(lastPoint.awsThroughput + (Math.random() * 30 - 15)));
    const azureTp = Math.max(280, Math.round(lastPoint.azureThroughput + (Math.random() * 40 - 20)));
    const gcpTp = Math.max(350, Math.round(lastPoint.gcpThroughput + (Math.random() * 26 - 13)));
    const multiTp = Math.max(900, Math.round(lastPoint.multiCloudThroughput + (Math.random() * 60 - 30)));
    
    this.telemetry.shift();
    this.telemetry.push({
      timestamp: timeString,
      awsLatency: awsLat,
      awsThroughput: awsTp,
      azureLatency: azureLat,
      azureThroughput: azureTp,
      gcpLatency: gcpLat,
      gcpThroughput: gcpTp,
      multiCloudLatency: multiLat,
      multiCloudThroughput: multiTp,
    });
    
    // Random status alarms (10% chance)
    if (Math.random() < 0.1) {
      const activeEnvs = this.environments.filter(e => e.isActive);
      if (activeEnvs.length > 0) {
        const randomEnv = activeEnvs[Math.floor(Math.random() * activeEnvs.length)];
        const alerts = [
          `Increased average latency registered on ${randomEnv.provider.toUpperCase()} servers.`,
          `High active connection load monitored in ${randomEnv.region}.`,
          `Audit logs pulled for ${randomEnv.name} compliance check.`
        ];
        const randomMsg = alerts[Math.floor(Math.random() * alerts.length)];
        this.addNotification('info', 'System Watchdog', randomMsg);
      }
    }
    
    this.notify();
  }

  // Auth Operations
  public login(email: string, role?: 'Student' | 'Researcher' | 'Admin'): boolean {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      this.log('Logged in successfully', 'auth', 'all', 'success');
      this.addNotification('success', 'Authentication', `Welcome back, ${user.displayName}!`);
      this.notify();
      return true;
    } else {
      // Auto register first-time logins to be user-friendly!
      const name = email.split('@')[0];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
      const newUser: RegisteredUser = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: capitalized,
        role: role || 'Student',
        institution: 'School of Technology Studies',
        createdAt: new Date().toISOString()
      };
      this.users.push(newUser);
      this.currentUser = newUser;
      this.log(`New session created and roles assigned for ${email}`, 'auth', 'all', 'success');
      this.addNotification('success', 'Registration', `Account initiated for ${email}. Default privileges: ${newUser.role}`);
      this.notify();
      return true;
    }
  }

  public logout() {
    if (this.currentUser) {
      this.log(`Session terminated for ${this.currentUser.email}`, 'auth', 'all', 'success');
    }
    this.currentUser = null;
    this.notify();
  }

  public getCurrentUser(): RegisteredUser | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  public setRole(uid: string, role: 'Student' | 'Researcher' | 'Admin') {
    const user = this.users.find(u => u.uid === uid);
    if (user) {
      user.role = role;
      this.log(`Updated permissions for ${user.displayName} to level ${role}`, 'admin', 'all', 'success');
      this.notify();
    }
  }

  public getUsers(): RegisteredUser[] {
    return this.users.map(u => ({ ...u }));
  }

  // Environment and Cluster operations
  public getEnvironments(): CloudEnvironment[] {
    return this.environments.map(e => ({ ...e }));
  }

  public toggleEnvironment(id: string) {
    const env = this.environments.find(e => e.id === id);
    if (env) {
      env.isActive = !env.isActive;
      const act = env.isActive ? 'Started' : 'Drained & Suspended';
      const stat = env.isActive ? 'success' : 'warning';
      
      this.log(`${act} all workload deployments inside ${env.name}`, 'resource', env.provider, stat);
      this.addNotification(env.isActive ? 'success' : 'warning', 'Workload Config Change', `${env.name} is now ${env.isActive ? 'ACTIVE' : 'OFFLINE'}.`);
      
      // Update resources status
      this.resources.forEach(r => {
        if (r.envId === id) {
          r.status = env.isActive ? 'running' : 'stopped';
        }
      });
      this.notify();
    }
  }

  public updateEnvironmentSecurityScore(id: string, score: number) {
    const env = this.environments.find(e => e.id === id);
    if (env) {
      env.securityScore = score;
      this.notify();
    }
  }

  // Provision new environment or modify servers
  public scaleEnvironmentInstance(id: string, newCount: number) {
    const env = this.environments.find(e => e.id === id);
    if (env) {
      const difference = newCount - env.serverCount;
      env.serverCount = newCount;
      env.costPerHour = Number((newCount * 0.17).toFixed(2));
      
      const actText = difference >= 0 
        ? `Scaled UP resources inside ${env.name}. Spawned ${difference} cluster instance(s).` 
        : `Drained and turned off ${Math.abs(difference)} instances inside ${env.name}.`;
      
      this.log(actText, 'resource', env.provider, 'success');
      
      // Update our resources list accordingly
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          const newId = `res-${env.provider}-${Date.now()}-${i}`;
          this.resources.push({
            id: newId,
            name: `${env.provider}-node-${Math.round(Math.random() * 800 + 100)}`,
            envId: env.id,
            provider: env.provider,
            type: 'compute',
            status: 'running',
            cpuUtilization: 35,
            ramUtilization: 48,
            diskUtilization: 25
          });
        }
      } else if (difference < 0) {
        // Remove computing nodes
        const nodes = this.resources.filter(r => r.envId === id && r.type === 'compute');
        const countToRemove = Math.abs(difference);
        for (let i = 0; i < countToRemove && i < nodes.length; i++) {
          this.resources = this.resources.filter(r => r.id !== nodes[i].id);
        }
      }
      this.notify();
    }
  }

  // Load Balancing Controls
  public getLbAlgorithm() {
    return this.lbAlgorithm;
  }

  public setLbAlgorithm(algo: 'round-robin' | 'latency' | 'failover') {
    this.lbAlgorithm = algo;
    this.log(`Global load balancer traffic pattern updated to: ${algo.toUpperCase()}`, 'performance', 'all', 'success');
    this.addNotification('info', 'Load Balancer Update', `Routing strategy modified to ${algo.toUpperCase()}`);
    this.notify();
  }

  // Resources Operations
  public getResources(provider?: CloudProvider): CustomResourceNode[] {
    if (provider) {
      return this.resources.filter(r => r.provider === provider).map(r => ({ ...r }));
    }
    return this.resources.map(r => ({ ...r }));
  }

  public toggleResourceNode(id: string) {
    const res = this.resources.find(r => r.id === id);
    if (res) {
      const originalStatus = res.status;
      res.status = originalStatus === 'running' ? 'stopped' : 'running';
      res.cpuUtilization = res.status === 'running' ? Math.round(20 + Math.random() * 40) : 0;
      res.ramUtilization = res.status === 'running' ? Math.round(40 + Math.random() * 30) : 0;
      
      this.log(`Node ${res.name} manually ${res.status === 'running' ? 'Booted' : 'Terminated'}`, 'resource', res.provider, 'success');
      this.notify();
    }
  }

  // Security Operations
  public getRisks(): SecurityRisk[] {
    return this.risks.map(r => ({ ...r }));
  }

  public remediateRisk(id: string) {
    const r = this.risks.find(risk => risk.id === id);
    if (r && r.status !== 'FIXED') {
      r.status = 'FIXED';
      
      // Improve the target cloud's security score
      if (r.provider !== 'hybrid') {
        const env = this.environments.find(e => e.provider === r.provider);
        if (env) {
          env.securityScore = Math.min(100, env.securityScore + 8);
          if (r.category === 'Encryption') {
            env.encryptionEnabled = true;
          }
        }
      } else {
        // Boost overall slightly
        this.environments.forEach(e => {
          e.securityScore = Math.min(100, e.securityScore + 4);
        });
      }

      this.log(`Remediation executed for audit flag: ${r.title}`, 'security', r.provider as any, 'success');
      this.addNotification('success', 'Vulnerability Mitigated', `Successfully fixed high security vulnerability: "${r.title}". Score increased.`);
      this.notify();
    }
  }

  public triggerThreatTest(type: 'ddos' | 'portscan' | 'drift') {
    if (type === 'ddos') {
      this.log('Simulating Heavy DDoS Workload (10k req/sec) across AWS and GCP nodes', 'performance', 'all', 'warning');
      this.addNotification('alert', 'Intrusion Detection System', 'Volumetric flood alert! Detecting trace signature similar to DDoS flood. Failover activated.');
      
      // Instantly spike CPU usage and latency of endpoints
      this.resources.forEach(res => {
        if (res.status === 'running' && res.type === 'compute') {
          res.status = 'heavy-load';
          res.cpuUtilization = Math.round(92 + Math.random() * 6);
          res.ramUtilization = Math.round(85 + Math.random() * 10);
        }
      });

      // Insert high latency spike into telemetries
      const lastPoint = this.telemetry[this.telemetry.length - 1];
      const time = new Date();
      this.telemetry.shift();
      this.telemetry.push({
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        awsLatency: 285,
        awsThroughput: 1450,
        azureLatency: 320,
        azureThroughput: 1200,
        gcpLatency: 195,
        gcpThroughput: 1800,
        multiCloudLatency: 85, // Load balancer absorbs the shock! Showing resilience
        multiCloudThroughput: 4450
      });
      
    } else if (type === 'portscan') {
      this.log('Triggered automatic vulnerability sweep scanner on multi-cloud endpoints.', 'security', 'all', 'success');
      const scanResults = this.risks.filter(risk => risk.status === 'VULNERABLE');
      if (scanResults.length > 0) {
        this.addNotification('warning', 'Scanner Results', `Cloud audit complete. Discovered ${scanResults.length} unresolved vulnerability warnings.`);
      } else {
        this.addNotification('success', 'Scanner Results', 'Zero drift or exposures identified. All systems conform to CIS Benchmark rules.');
      }
    } else if (type === 'drift') {
      // Cause an environment Azure to drift (e.g. disable some parameters)
      const azureEnv = this.environments.find(e => e.provider === 'azure');
      if (azureEnv) {
        azureEnv.securityScore = Math.max(40, azureEnv.securityScore - 15);
        
        // Add or reactivate Azure warning
        const risk = this.risks.find(r => r.id === 'risk-2');
        if (risk) risk.status = 'VULNERABLE';
        
        this.log('Configuration drift detected in Entra ID firewall rules!', 'security', 'azure', 'error');
        this.addNotification('alert', 'Drift Analyzer Alert', 'Resource drifted! Config drift detected in Azure DB Firewalls.');
      }
    }
    this.notify();
  }

  // Log Operations
  public getLogs(filterCategory?: string, searchWord?: string): ActivityLog[] {
    let output = [...this.logs];
    if (filterCategory && filterCategory !== 'all') {
      output = output.filter(l => l.category === filterCategory);
    }
    if (searchWord) {
      const q = searchWord.toLowerCase();
      output = output.filter(l => 
        l.action.toLowerCase().includes(q) || 
        l.userEmail.toLowerCase().includes(q)
      );
    }
    // Return sorted by reverse timestamp
    return output.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public log(action: string, category: ActivityLog['category'], provider?: CloudProvider | 'all', status: ActivityLog['status'] = 'success') {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: this.currentUser ? this.currentUser.uid : 'anonymous',
      userEmail: this.currentUser ? this.currentUser.email : 'Guest Session',
      action,
      category,
      provider,
      status
    };
    this.logs.unshift(newLog);
    // Keep length bounded to 150
    if (this.logs.length > 150) {
      this.logs.pop();
    }
    this.notify();
  }

  // Notifications Operations
  public getNotifications(): SystemNotification[] {
    return this.notifications.map(n => ({ ...n }));
  }

  public markAllNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }

  public clearNotifications() {
    this.notifications = [];
    this.notify();
  }

  public addNotification(type: SystemNotification['type'], title: string, message: string) {
    this.notifications.unshift({
      id: `not-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    });
    // Limit to 20
    if (this.notifications.length > 20) {
      this.notifications.pop();
    }
    this.notify();
  }

  // Telemetry chart getters
  public getTelemetryData(): PerformanceMetric[] {
    return this.telemetry.map(t => ({ ...t }));
  }

  // System Health Overview Score
  public getGlobalOverallScores() {
    const activeEnvs = this.environments.filter(e => e.isActive);
    if (activeEnvs.length === 0) {
      return { security: 0, performance: 0, health: 0, cost: 0 };
    }
    
    // Average security score of active clouds
    const sumSec = activeEnvs.reduce((acc, curr) => acc + curr.securityScore, 0);
    const avgSecurity = Math.round(sumSec / activeEnvs.length);
    
    // Performance score is derived from aggregate latency and workload nodes running
    const runningComputeCount = this.resources.filter(r => r.status === 'running' && r.type === 'compute').length;
    const peakThroughput = activeEnvs.length * 400; 
    let performanceScore = 75;
    if (this.lbAlgorithm === 'latency') performanceScore += 18;
    else if (this.lbAlgorithm === 'round-robin') performanceScore += 10;
    else performanceScore += 5; // failover prioritizes safety not peak delivery speeds

    // Scale performance score downward slightly if heavily overloaded
    const heavyLoadCount = this.resources.filter(r => r.status === 'heavy-load').length;
    performanceScore = Math.max(30, Math.min(100, performanceScore - (heavyLoadCount * 6)));
    
    // Overal health is average of both
    const overallHealth = Math.round((avgSecurity + performanceScore) / 2);
    
    // Aggregate hourly costs
    const totalCost = Number(activeEnvs.reduce((sum, e) => sum + e.costPerHour, 0).toFixed(2));

    return {
      security: avgSecurity,
      performance: performanceScore,
      health: overallHealth,
      cost: totalCost
    };
  }
}

export const platformDb = new CloudPlatformDatabase();
