const Button = ({ children, onClick, disabled, className }) => {

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export { Button }; 