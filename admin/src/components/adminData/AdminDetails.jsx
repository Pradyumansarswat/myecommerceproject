import React from "react";
import AdminProfile from "./AdminProfile";
import LogOutAdmin from "./LogOutAdmin";
import DetailsAdmin from "./DetailsAdmin";

const AdminDetails = ({ setShowFullDetails }) => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <AdminProfile />
      <DetailsAdmin setShowFullDetails={setShowFullDetails} />
      <LogOutAdmin />
    </div>
  );
};

export default AdminDetails;
