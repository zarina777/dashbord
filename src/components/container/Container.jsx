const Container = ({ children, className }) => {
  return <div className={"max-w-[1200px] w-full m-auto " + className}>{children}</div>;
};

export default Container;
