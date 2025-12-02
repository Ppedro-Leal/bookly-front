import { Button } from "./ui/button";

const NavButton = ({ href, icon: Icon, size, variant, children }) => (
  <Button
    className="cursor-pointer"
    size={size ? size : "default"}
    variant={variant}
    onClick={() => navigate(href)}
  >
    <Icon className="h-5 w-5 mr-1" />
    {children}
  </Button>
);

export { NavButton };
