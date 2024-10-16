import React from "react";

interface FollowButtonProps {
  id: string;
  className: string;
  onClick: (event: React.MouseEvent) => void;
  isLoading: boolean;
  buttonText: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  id,
  className,
  onClick,
  isLoading,
  buttonText,
}) => {
  return (
    <button
      id={id}
      className={className}
      type="submit"
      style={{ width: "6em" }}
      onClick={onClick}
    >
      {isLoading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        <div>{buttonText}</div>
      )}
    </button>
  );
};

