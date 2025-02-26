import { TenantConfig } from './types';

// Simple in-memory store for the proof of concept
export const tenants = new Map<string, TenantConfig>();