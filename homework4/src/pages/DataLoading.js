import {Suspense} from "react";
import {useLoaderData} from "../which";

export default function DataLoading(props) {
  const data = useLoaderData();
  const user = data.results[0];
  return (
    <div>
      <h3>DataLoading</h3>
      <Suspense fallback={<h1>loading...</h1>}>
        <p>{user.name.first}</p>
      </Suspense>
    </div>
  );
}

export async function loaderOfDataLoading() {
  const user = await fetch("https://randomuser.me/api");
  return user;
}
