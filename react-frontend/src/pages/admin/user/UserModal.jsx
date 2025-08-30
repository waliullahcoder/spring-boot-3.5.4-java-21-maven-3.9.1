import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

const UserModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>
        <Typography variant="h5">User Details</Typography>
      </DialogHeader>
      <DialogBody>
        <div className="space-y-2">
          <Typography variant="small"><strong>User ID:</strong> {user.id}</Typography>
          <Typography variant="small"><strong>Name:</strong> {user.first_name} {user.last_name}</Typography>
          <Typography variant="small"><strong>Email:</strong> {user.email || "N/A"}</Typography>
          <Typography variant="small"><strong>Phone:</strong> {user.phone_number || "N/A"}</Typography>
          <Typography variant="small"><strong>Zip Code:</strong> {user.zip_code || "N/A"}</Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UserModal;
