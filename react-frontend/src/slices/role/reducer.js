import { createSlice } from '@reduxjs/toolkit';
import { createRole, fetchRoles, updateRole, deleteRole } from './action';
import { initialRoleState } from './state';

const defaultErrorMessage = 'An unexpected error occurred. Please try again.';

const roleSlice = createSlice({
  name: 'role',
  initialState: initialRoleState,
  reducers: {
    resetRoleState: () => initialRoleState,
  },
  extraReducers: (builder) => {
    builder
      // Create Role
      .addCase(createRole.pending, (state) => {
        state.status = 'loading';
        state.error = { message: null }; 
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.role = action.payload;
        state.roles = [...state.roles, action.payload]; // ✅ Simplified
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.payload || defaultErrorMessage }; // ✅ Use payload
      })

      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
        state.error = { message: null };
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = Array.isArray(action.payload) ? action.payload : [];
        state.status = Array.isArray(action.payload) ? 'succeeded' : 'failed';
        state.error = Array.isArray(action.payload) ? null : { message: 'Invalid data received.' };
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = { message: action.payload || defaultErrorMessage };
      })

      // Update Role
      .addCase(updateRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedRole = action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
      })

      // Delete Role
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = state.roles.filter(role => role.id !== action.payload.id);
      });
  },
});

export default roleSlice.reducer;
