import {useNavigate, useParams, navigate} from "../which";

export default function ProductDetail(props) {
  let navigate = useNavigate();
  const params = useParams();
  return (
    <div>
      <h1>ProductDetail</h1>
      <p>{params.id}</p>
      {/* <button onClick={() => navigate("/")}>go home</button> */}
      <button onClick={() => navigate(-1)}>back</button>
    </div>
  );
}
