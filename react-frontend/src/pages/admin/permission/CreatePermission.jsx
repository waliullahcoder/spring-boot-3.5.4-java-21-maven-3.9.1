import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../slices/role/action";
import { createPermission, updatePermission } from "../../../slices/permission/action";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const permissionChecks = ["create", "listing", "view", "edit", "delete", "allow"];
const modules = [
  { id: "usrid01", name: "Users" },
  { id: "ctgid01", name: "Categories" },
  { id: "pdid01", name: "Products" },
  { id: "prchsid01", name: "Purchases" },
  { id: "invid01", name: "Invoices" },
  { id: "custid01", name: "Customers" },
  { id: "vendid01", name: "Vendors" },
  { id: "rolid01", name: "Roles" },
  { id: "permid01", name: "Permissions" },
];

const PermissionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { roles } = useSelector((state) => state.role);

  var [isChangeRole, setIsChangeRole] = useState(false);
  var [selectedRole, setSelectedRole] = useState(null);
  const [permissionsState, setPermissionsState] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [permissionCount, setPermissionCount] = useState(0);

  // Fetch roles on mount
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);
 

  // Fetch permissions for selected role
  const fetchRolePermissions = async (roleId) => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/permission/edit/${roleId}`);
      const existingPermissions = response.data;
      const permissioncount = existingPermissions.length;
      setPermissionCount(permissioncount);
      
      const formattedPermissions = modules.reduce((acc, module) => {
        const found = existingPermissions.find((perm) => perm.module_id === module.id);
        acc[module.id] = {
          module_id: module.id,
          module_name: module.name,
          permissions: permissionChecks.reduce((pAcc, perm) => {
            pAcc[perm] = found ? found[perm] : false;
            return pAcc;
          }, {}),
        };
        return acc;
      }, {});

      setPermissionsState(formattedPermissions);
      setSelectedRole(roles.find((role) => role.id === roleId));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setLoading(false);
    }
  };

  // If editing, fetch role permissions
  useEffect(() => {
    if (isEdit && roles.length > 0) {
      fetchRolePermissions(id);
    }
  }, [isEdit, id, roles]);

  useEffect(() => {
    if(isChangeRole===true){
      setIsChangeRole(true);
    }else{
      setIsChangeRole(false);
    }
      
    
  }, [isChangeRole]);

  // Handle role selection
  const handleRoleChange = (selectedOption) => { 

    setSelectedRole(selectedOption.value);
    setIsChangeRole(true);
    fetchRolePermissions(selectedOption.value);
  
    
  };
 
  // Handle Select All for all modules
  const handleSelectAllModule = (checked) => {
    setPermissionsState(
      modules.reduce((acc, module) => {
        acc[module.id] = {
          module_id: module.id,
          module_name: module.name,
          permissions: permissionChecks.reduce((pAcc, perm) => {
            pAcc[perm] = checked;
            return pAcc;
          }, {}),
        };
        return acc;
      }, {})
    );
  };

  // Handle Select All for individual modules
  const handleSelectAll = (moduleId, checked) => {
    setPermissionsState((prev) => ({
      ...prev,
      [moduleId]: {
        module_id: moduleId,
        module_name: modules.find((mod) => mod.id === moduleId)?.name || "",
        permissions: permissionChecks.reduce((acc, perm) => {
          acc[perm] = checked;
          return acc;
        }, {}),
      },
    }));
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (moduleId, permission) => {
    setPermissionsState((prev) => ({
      ...prev,
      [moduleId]: {
        module_id: moduleId,
        module_name: modules.find((mod) => mod.id === moduleId)?.name || "",
        permissions: {
          ...(prev[moduleId]?.permissions || {}), // Fixed incorrect key usage
          [permission]: !prev[moduleId]?.permissions?.[permission],
        },
      },
    }));
  };
  
if(isEdit && isChangeRole===false){
       selectedRole = roles.find((role) => role.id === Number(id));
    }
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const role_id = selectedRole?.id;
    
    console.log("WALI role id2",selectedRole?.id);
    console.log("WALI ROLE ID",role_id);
    const modulesData = Object.values(permissionsState);
    const payload = { role_id, modules: modulesData };

    try {
      if (isEdit) {
        await dispatch(updatePermission({ id, ...payload })).unwrap();
        setSuccessMessage("Permission updated successfully!");
      } else {
        await dispatch(createPermission(payload)).unwrap();
        setSuccessMessage("Permission created successfully!");
      }
      setTimeout(() => navigate("/admin/permission/list"), 2000);
    } catch (error) {
      console.error("Error submitting permissions:", error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full mx-auto p-5 bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        {isEdit ? "Edit Permissions" : "Create Permissions"}
      </h2>

      {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

      {/* Role Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Role </label>
      

          <Select
          options={roles.map((role) => ({ value: role.id, label: `${role.name} (RoleID: ${role.id}) (UserId: ${role.user_id})` }))}
          value={ 
            isEdit && isChangeRole===false ?  
            selectedRole? {value: selectedRole.id,label: `${selectedRole.name} (RoleID: ${selectedRole.id}) (UserId: ${selectedRole.user_id})`}: null 
            : 
            roles.find((role) => role.id === selectedRole?.value)
           
          }
         
          onChange={handleRoleChange}
          isLoading={roles.length === 0}
          placeholder="Select a Role"
        />
      </div>

      {/* Select All Modules */}
      <div className="flex items-center justify-center mb-4">
        <Checkbox label="Select All Modules" onChange={(e) => handleSelectAllModule(e.target.checked)} />
      </div>

      {/* Modules Permissions Grid */}
      <div className="grid grid-cols-2 gap-8">
        {modules.map((module) => (
          <div key={module.id} className="mb-2 border p-2 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-700 text-sm font-bold">{module.name} Permissions</label>
              <Checkbox
                checked={permissionsState[module.id]?.permissions && Object.values(permissionsState[module.id]?.permissions).every(Boolean)}
                onChange={(e) => handleSelectAll(module.id, e.target.checked)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {permissionChecks.map((perm) => (
                <Checkbox
                  key={perm}
                  label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                  checked={permissionsState[module.id]?.permissions?.[perm] || false}
                  onChange={() => handleCheckboxChange(module.id, perm)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        color="blue" 
        fullWidth 
        disabled={loading || (permissionCount > 0  && !isEdit)}
      >
        {loading ? "Saving..." : isEdit ? "Update Permission" : "Create Permission"}
      </Button>

    </form>
  );
};

export default PermissionForm;
