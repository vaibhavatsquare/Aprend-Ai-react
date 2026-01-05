import React, { useState } from "react";
import { Modal } from "antd";
import { signOutUser } from "@/src/services/auth/auth.service";
import { useRedirect } from "@/src/hooks/router.hooks";
import { removeCookie } from "@/src/services/coockies/coockie.service";

const LogoutModal = ({ isModalOpen, setIsModalOpen }: any) => {

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOutUser();
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalOpen(false);
      removeCookie("idToken");
      localStorage.clear();
      useRedirect("/login", true);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Logout"
      centered
      open={isModalOpen}
      onOk={handleLogout}
      okText="Logout"
      okButtonProps={{
        danger: true,
        loading,
      }}
      onCancel={() => setIsModalOpen(false)}
      width={400}
    >
      <p>Are you sure you want to logout?</p>
    </Modal>
  );
};

export default LogoutModal;
