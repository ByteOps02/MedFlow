import { supabase } from './client';
import { TablesInsert, TablesUpdate } from '../types/supabase';

// Generic fetch all
export async function fetchAll<T>(tableName: string): Promise<T[] | null> {
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`Error fetching all from ${tableName}:`, error);
    return null;
  }
  return data as T[];
}

// Generic fetch by ID
export async function fetchById<T>(tableName: string, id: string): Promise<T | null> {
  const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();
  if (error) {
    console.error(`Error fetching from ${tableName} with ID ${id}:`, error);
    return null;
  }
  return data as T;
}

// Generic insert
export async function insertInto<T extends TablesInsert<any>>(tableName: string, record: T): Promise<T | null> {
  const { data, error } = await supabase.from(tableName).insert(record).select().single();
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    return null;
  }
  return data as T;
}

// Generic update
export async function updateById<T extends TablesUpdate<any>>(tableName: string, id: string, updates: T): Promise<T | null> {
  const { data, error } = await supabase.from(tableName).update(updates).eq('id', id).select().single();
  if (error) {
    console.error(`Error updating ${tableName} with ID ${id}:`, error);
    return null;
  }
  return data as T;
}

// Generic delete
export async function deleteById(tableName: string, id: string): Promise<boolean> {
  const { error } = await supabase.from(tableName).delete().eq('id', id);
  if (error) {
    console.error(`Error deleting from ${tableName} with ID ${id}:`, error);
    return false;
  }
  return true;
}

// --- Specific API functions for each table ---

// Profiles
export async function fetchProfiles() {
  return fetchAll<Tables<'profiles'>>('profiles');
}

export async function fetchProfileById(id: string) {
  return fetchById<Tables<'profiles'>>('profiles', id);
}

export async function insertProfile(profile: TablesInsert<'profiles'>) {
  return insertInto('profiles', profile);
}

export async function updateProfile(id: string, updates: TablesUpdate<'profiles'>) {
  return updateById('profiles', id, updates);
}

// Products
export async function fetchProducts() {
  return fetchAll<Tables<'products'>>('products');
}

export async function fetchProductById(id: string) {
  return fetchById<Tables<'products'>>('products', id);
}

export async function insertProduct(product: TablesInsert<'products'>) {
  return insertInto('products', product);
}

export async function updateProduct(id: string, updates: TablesUpdate<'products'>) {
  return updateById('products', id, updates);
}

// Batches
export async function fetchBatches() {
  return fetchAll<Tables<'batches'>>('batches');
}

export async function fetchBatchById(id: string) {
  return fetchById<Tables<'batches'>>('batches', id);
}

export async function insertBatch(batch: TablesInsert<'batches'>) {
  return insertInto('batches', batch);
}

export async function updateBatch(id: string, updates: TablesUpdate<'batches'>) {
  return updateById('batches', id, updates);
}

// Suppliers
export async function fetchSuppliers() {
  return fetchAll<Tables<'suppliers'>>('suppliers');
}

export async function fetchSupplierById(id: string) {
  return fetchById<Tables<'suppliers'>>('suppliers', id);
}

export async function insertSupplier(supplier: TablesInsert<'suppliers'>) {
  return insertInto('suppliers', supplier);
}

export async function updateSupplier(id: string, updates: TablesUpdate<'suppliers'>) {
  return updateById('suppliers', id, updates);
}

// Purchase Orders
export async function fetchPurchaseOrders() {
  return fetchAll<Tables<'purchase_orders'>>('purchase_orders');
}

export async function fetchPurchaseOrderById(id: string) {
  return fetchById<Tables<'purchase_orders'>>('purchase_orders', id);
}

export async function insertPurchaseOrder(order: TablesInsert<'purchase_orders'>) {
  return insertInto('purchase_orders', order);
}

export async function updatePurchaseOrder(id: string, updates: TablesUpdate<'purchase_orders'>) {
  return updateById('purchase_orders', id, updates);
}

// Purchase Order Items
export async function fetchPurchaseOrderItems() {
  return fetchAll<Tables<'purchase_order_items'>>('purchase_order_items');
}

export async function fetchPurchaseOrderItemById(id: string) {
  return fetchById<Tables<'purchase_order_items'>>('purchase_order_items', id);
}

export async function insertPurchaseOrderItem(item: TablesInsert<'purchase_order_items'>) {
  return insertInto('purchase_order_items', item);
}

export async function updatePurchaseOrderItem(id: string, updates: TablesUpdate<'purchase_order_items'>) {
  return updateById('purchase_order_items', id, updates);
}

// Sales Orders
export async function fetchSalesOrders() {
  return fetchAll<Tables<'sales_orders'>>('sales_orders');
}

export async function fetchSalesOrderById(id: string) {
  return fetchById<Tables<'sales_orders'>>('sales_orders', id);
}

export async function insertSalesOrder(order: TablesInsert<'sales_orders'>) {
  return insertInto('sales_orders', order);
}

export async function updateSalesOrder(id: string, updates: TablesUpdate<'sales_orders'>) {
  return updateById('sales_orders', id, updates);
}

// Sales Order Items
export async function fetchSalesOrderItems() {
  return fetchAll<Tables<'sales_order_items'>>('sales_order_items');
}

export async function fetchSalesOrderItemById(id: string) {
  return fetchById<Tables<'sales_order_items'>>('sales_order_items', id);
}

export async function insertSalesOrderItem(item: TablesInsert<'sales_order_items'>) {
  return insertInto('sales_order_items', item);
}

export async function updateSalesOrderItem(id: string, updates: TablesUpdate<'sales_order_items'>) {
  return updateById('sales_order_items', id, updates);
}

// Quality Control Records
export async function fetchQualityControlRecords() {
  return fetchAll<Tables<'quality_control_records'>>('quality_control_records');
}

export async function fetchQualityControlRecordById(id: string) {
  return fetchById<Tables<'quality_control_records'>>('quality_control_records', id);
}

export async function insertQualityControlRecord(record: TablesInsert<'quality_control_records'>) {
  return insertInto('quality_control_records', record);
}

export async function updateQualityControlRecord(id: string, updates: TablesUpdate<'quality_control_records'>) {
  return updateById('quality_control_records', id, updates);
}

// Roles
export async function fetchRoles() {
  return fetchAll<Tables<'roles'>>('roles');
}

export async function fetchRoleById(id: string) {
  return fetchById<Tables<'roles'>>('roles', id);
}

export async function insertRole(role: TablesInsert<'roles'>) {
  return insertInto('roles', role);
}

export async function updateRole(id: string, updates: TablesUpdate<'roles'>) {
  return updateById('roles', id, updates);
}

// User Roles
export async function fetchUserRoles() {
  return fetchAll<Tables<'user_roles'>>('user_roles');
}

export async function fetchUserRoleById(userId: string, roleId: string) {
  const { data, error } = await supabase.from('user_roles').select('*').eq('user_id', userId).eq('role_id', roleId).single();
  if (error) {
    console.error(`Error fetching user_role with user_id ${userId} and role_id ${roleId}:`, error);
    return null;
  }
  return data as Tables<'user_roles'>;
}

export async function insertUserRole(userRole: TablesInsert<'user_roles'>) {
  return insertInto('user_roles', userRole);
}

export async function updateUserRole(userId: string, roleId: string, updates: TablesUpdate<'user_roles'>) {
  const { data, error } = await supabase.from('user_roles').update(updates).eq('user_id', userId).eq('role_id', roleId).select().single();
  if (error) {
    console.error(`Error updating user_role with user_id ${userId} and role_id ${roleId}:`, error);
    return null;
  }
  return data as Tables<'user_roles'>;
}

export async function deleteUserRole(userId: string, roleId: string): Promise<boolean> {
  const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role_id', roleId);
  if (error) {
    console.error(`Error deleting user_role with user_id ${userId} and role_id ${roleId}:`, error);
    return false;
  }
  return true;
}

// Settings
export async function fetchSettings() {
  return fetchAll<Tables<'settings'>>('settings');
}

export async function fetchSettingById(id: string) {
  return fetchById<Tables<'settings'>>('settings', id);
}

export async function insertSetting(setting: TablesInsert<'settings'>) {
  return insertInto('settings', setting);
}

export async function updateSetting(id: string, updates: TablesUpdate<'settings'>) {
  return updateById('settings', id, updates);
}

// Reports
export async function fetchReports() {
  return fetchAll<Tables<'reports'>>('reports');
}

export async function fetchReportById(id: string) {
  return fetchById<Tables<'reports'>>('reports', id);
}

export async function insertReport(report: TablesInsert<'reports'>) {
  return insertInto('reports', report);
}

export async function updateReport(id: string, updates: TablesUpdate<'reports'>) {
  return updateById('reports', id, updates);
}
