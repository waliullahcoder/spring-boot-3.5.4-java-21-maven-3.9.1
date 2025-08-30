import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createPermissionApiAxios, 
  permissionListApiAxios, 
  updatePermissionApiAxios,
  deletePermissionApiAxios 
} from '../../services/permission/permissionService';

const thunksPermission = {
  create: 'create',
  list: 'list',
  update: 'update',
  delete: 'delete',
};

export const createPermission = createAsyncThunk(
  thunksPermission.create,  // ✅ Use a string 
  async (permissionData, { rejectWithValue }) => {
    console.log("WA:O ACTION", permissionData);  // Logs the data
    
    try {
      const response = await createPermissionApiAxios(permissionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  thunksPermission.list,  // ✅ Use a string
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionListApiAxios();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);

export const updatePermission = createAsyncThunk(
  thunksPermission.updatePermission,  // ✅ Use a string
  async ({ id, role_id, modules }, { rejectWithValue }) => {
    try {
      const response = await updatePermissionApiAxios(id, { role_id, modules });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);

export const deletePermission = createAsyncThunk(
  thunksPermission.delete,  // ✅ Use a string
  async (id, { rejectWithValue }) => {
    try {
      await deletePermissionApiAxios(id);
      return { id }; // ✅ Return only the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);
