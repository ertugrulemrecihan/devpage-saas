interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="bg-white w-full h-screen overflow-hidden p-3">
      {children}
    </div>
  );
};

export default ProtectedLayout;
