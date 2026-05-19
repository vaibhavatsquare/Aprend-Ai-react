import { Button } from "antd";
import { ButtonProps } from "antd/es/button";

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton = ({ children, className = "", ...props }: PrimaryButtonProps) => {
  return (
    <Button
      {...props}
      type="default"
      className={`btn-primary h-[48px] w-full font-medium text-[15px] ${className}`}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;