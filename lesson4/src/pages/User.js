import {useNavigate} from "../which";
import {useAuth} from "../layouts/AuthProvider";

export default function User() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>User</h1>
      <p>{auth.user?.username}</p>
      <button
        onClick={() => {
          auth.signout(() => navigate("/login"));
        }}>
        退出登录
      </button>
    </div>
  );
}
