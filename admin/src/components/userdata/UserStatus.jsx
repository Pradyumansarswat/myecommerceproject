import React from "react";
import { useDispatch } from "react-redux";
import { updateUserStatus } from "../../redux/slices/userSlice";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { toast, Toaster } from "react-hot-toast";

const UserStatus = ({ status, id, userName }) => {
  const dispatch = useDispatch();

  const handleStatus = async () => {
    const newStatus = status === "active" ? "inactive" : "active";
    try {
      await dispatch(updateUserStatus({ userId: id, newStatus })).unwrap();
      toast.success(`User ${userName} ${newStatus} successfully`, {
        style: {
          border: "1px solid #000",
          padding: "16px",
          backgroundColor: "#000",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error(`Error updating status: ${error.message}`);
    }
  };

  return (
    <>
      <button
        onClick={handleStatus}
        title={status === "active" ? "Block User" : "Unblock User"}
        className="flex items-center w-full px-4 gap-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {status === "active" ? (
          <MdBlock size={25} color="red" />
        ) : (
          <CgUnblock size={25} color="green" />
        )}
        {status === "active" ? "Block" : "Unblock"}
      </button>
    </>
  );
};

export default UserStatus;
