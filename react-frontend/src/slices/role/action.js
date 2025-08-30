import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createRoleApiAxios, 
  roleListApiAxios, 
  updateRoleApiAxios,
  deleteRoleApiAxios 
} from '../../services/role/roleService';


const thunksRole = {
  create: 'create',
  list: 'list',
  update: 'update',
  delete: 'delete',
};

export const createRole = createAsyncThunk(
  thunksRole.create,  // ✅ Use a string 
  async (roleData, { rejectWithValue }) => {
    console.log("WA:O ACTION",roleData);
    
    try {
      const response = await createRoleApiAxios(roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);

export const fetchRoles = createAsyncThunk(
  thunksRole.list,  // ✅ Use a string
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleListApiAxios();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);

export const updateRole = createAsyncThunk(
  thunksRole.updateRole,  // ✅ Use a string
  async ({ id, user_id, name }, { rejectWithValue }) => {
    try {
      const response = await updateRoleApiAxios(id, {  user_id, name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);

export const deleteRole = createAsyncThunk(
  thunksRole.delete,  // ✅ Use a string
  async (id, { rejectWithValue }) => {
    try {
      await deleteRoleApiAxios(id);
      return { id }; // ✅ Return only the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong. Please try again.');
    }
  }
);
