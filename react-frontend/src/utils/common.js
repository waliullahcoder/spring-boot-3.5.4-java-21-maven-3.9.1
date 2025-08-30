import { useState, useEffect } from "react";
import { useUser, fetchPermissionSingleData } from "./helpers"; 

export const usePermissions = () => {
    const currentUser = useUser(); // Get logged-in user from Redux
    const [permissionSingle, setPermissions] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (currentUser?.id) {
                setLoading(true);
                const data = await fetchPermissionSingleData(currentUser.id);
                setPermissions(data);
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [currentUser]);

    return { permissionSingle, loading };
};



export const usePermissionBoolean = () => {
    const currentUser = useUser();
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPermissions = async () => {
            if (currentUser?.id) {
                setLoading(true);
                try {
                    const data = await fetchPermissionSingleData(currentUser.id);
                    const transformedPermissions = data.reduce((acc, { module_name, create, edit, view, delete: del, listing, allow }) => {
                        const keyBase = module_name.toLowerCase();
                        acc[`${keyBase}Create`] = Boolean(create);
                        acc[`${keyBase}Edit`] = Boolean(edit);
                        acc[`${keyBase}View`] = Boolean(view);
                        acc[`${keyBase}Delete`] = Boolean(del);
                        acc[`${keyBase}Listing`] = Boolean(listing);
                        acc[`${keyBase}Allow`] = Boolean(allow);
                        return acc;
                    }, {});

                    setPermissions(transformedPermissions);
                } catch (error) {
                    console.error("Error fetching permissions:", error);
                }
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [currentUser]);

    return { permissions, loading };
};

