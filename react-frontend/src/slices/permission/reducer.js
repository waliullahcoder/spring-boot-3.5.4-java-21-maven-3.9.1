import { createSlice } from '@reduxjs/toolkit';
import { createPermission, fetchPermissions, updatePermission, deletePermission } from './action';
import { initialPermissionState } from './state';

const defaultErrorMessage = 'An unexpected error occurred. Please try again.';

const permissionSlice = createSlice({
  name: 'permission',
  initialState: initialPermissionState,
  reducers: {
    resetRoleState: () => initialPermissionState,
  },
  extraReducers: (builder) => {
    builder
      // Create Permission
      .addCase(createPermission.pending, (state) => {
        state.status = 'loading';
        state.error = { message: null }; 
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.permission = action.payload;
        state.permissions = [...state.permissions, action.payload]; // ✅ Simplified
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.payload || defaultErrorMessage }; // ✅ Use payload
      })

      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.status = 'loading';
        state.error = { message: null };
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = Array.isArray(action.payload) ? action.payload : [];
        state.status = Array.isArray(action.payload) ? 'succeeded' : 'failed';
        state.error = Array.isArray(action.payload) ? null : { message: 'Invalid data received.' };
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.payload || defaultErrorMessage };
      })

      // Update Permission
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedPermission = action.payload;
        const index = state.permissions.findIndex(permission => permission.id === updatedPermission.id);
        if (index !== -1) {
          state.permissions[index] = updatedPermission;
        }
      })

      // Delete Permission
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.permissions = state.permissions.filter(permission => permission.id !== action.payload.id);
      });
  },
});

export default permissionSlice.reducer;
