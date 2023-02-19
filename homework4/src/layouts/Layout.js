import {Outlet} from "../which";
import CustomLink from "../components/CustomLink";

export default function Layout(props) {
  return (
    <div className="border">
      <CustomLink to="/">首页</CustomLink>
      <CustomLink to="/about">关于lazy</CustomLink>
      <CustomLink to="/product">商品-动态路由</CustomLink>
      <CustomLink to="/user">用户中心-权限</CustomLink>
      <CustomLink to="/login">login</CustomLink>
      <CustomLink to="/dataloading">loader</CustomLink>

      <Outlet />
    </div>
  );
}
