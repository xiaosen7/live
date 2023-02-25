import CustomLink from "../components/CustomLink";
import {Outlet} from "../which";

export default function Product(props) {
  return (
    <div>
      <h3>Product</h3>

      <CustomLink to="/product/123">商品详情</CustomLink>
      <Outlet />
    </div>
  );
}
