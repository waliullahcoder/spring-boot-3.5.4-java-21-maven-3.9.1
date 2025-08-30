import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, CardBody, Typography, CardHeader, Input } from "@material-tailwind/react";
import { fetchUserList } from "../../../slices/auth/authSlice";
import UserModal from "./UserModal"; // Import modal component

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth?.users) || [];
  const status = useSelector((state) => state.auth?.status) || "idle";
  const error = useSelector((state) => state.auth?.error) || null;

  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const filteredUsers = users.filter((user) =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * categoryPerPage;
  const indexOfFirstUser = indexOfLastUser - categoryPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / categoryPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue-gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">User List</Typography>
        </CardHeader>

        <CardHeader className="mb-8 p-6">
          <Input
            label="Search by User Name"
            type="text"
            placeholder="Search by User Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {status === "loading" ? (
            <Typography className="text-center mt-5">Loading...</Typography>
          ) : error ? (
            <Typography variant="small" color="red" className="text-center mt-5">
              Error: {error}
            </Typography>
          ) : currentUsers.length > 0 ? (
            <>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["S/L", "User ID", "Name", "Email", "Phone Number", "Zip Code", "Actions"].map((el) => (
                      <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => {
                    const className = `py-3 px-5 border-b border-blue-gray-50`;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className={className}>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {indexOfFirstUser + index + 1}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.id}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.first_name} {user.last_name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.email}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.phone_number}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {user.zip_code}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex gap-2">
                            <Button size="sm" variant="text" color="blue" onClick={() => handleViewUser(user)}>
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <Button color="blue" variant="text" onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <Typography variant="small">Page {currentPage} of {totalPages}</Typography>
                <Button color="blue" variant="text" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Typography className="text-center p-5">No Users found.</Typography>
          )}
        </CardBody>
      </Card>

      {/* User Details Modal */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={selectedUser} />
    </div>
  );
};

export default UserList;
