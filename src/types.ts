/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Cloud Provider Definition
export type CloudProvider = 'aws' | 'azure' | 'gcp';

export interface CloudRegion {
  id: string;
  name: string;
  provider: CloudProvider;
  latencyMultiplier: number; // base latency in ms * multiplier
  costFactor: number;
}

export interface CloudEnvironment {
  id: string;
  name: string;
  provider: CloudProvider;
  region: string;
  isActive: boolean;
  serverCount: number;
  instanceType: string;
  dbType: string;
  securityScore: number;
  encryptionEnabled: boolean;
  firewallRules: number;
  costPerHour: number;
}

// Telemetry Metric Log for charts
export interface PerformanceMetric {
  timestamp: string; // HH:mm:ss
  awsLatency: number;
  awsThroughput: number;
  azureLatency: number;
  azureThroughput: number;
  gcpLatency: number;
  gcpThroughput: number;
  multiCloudLatency: number;
  multiCloudThroughput: number;
}

export interface SecurityRisk {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  provider: CloudProvider | 'hybrid';
  category: 'Access Control' | 'Encryption' | 'Configuration' | 'Network' | 'Vulnerability';
  status: 'VULNERABLE' | 'RESTRICTED' | 'FIXED';
  description: string;
  remediation: string;
}

export interface CustomResourceNode {
  id: string;
  name: string;
  envId: string;
  provider: CloudProvider;
  type: 'compute' | 'storage' | 'database' | 'cdn';
  status: 'running' | 'stopped' | 'terminated' | 'heavy-load';
  cpuUtilization: number;
  ramUtilization: number;
  diskUtilization: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string
  userId: string;
  userEmail: string;
  action: string;
  category: 'auth' | 'resource' | 'security' | 'performance' | 'admin' | 'study';
  provider?: CloudProvider | 'all';
  status: 'success' | 'warning' | 'error';
}

export interface ResearchPaperSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface RegisteredUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'Student' | 'Researcher' | 'Admin';
  institution: string;
  createdAt: string;
}
