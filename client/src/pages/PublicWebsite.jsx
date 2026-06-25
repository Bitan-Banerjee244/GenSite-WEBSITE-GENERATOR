import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function PublicWebsite() {
  const { slug, siteid } = useParams();
  console.log(slug, siteid);

  const [website, setWebsite] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/web/site/${slug}`)
      .then((res) => {
        console.log(res)
        setWebsite(res.data.website);
      });
  }, []);

  if (!website) return <h1>Loading...</h1>;

  return (
    <iframe
      srcDoc={website.code}
      className="w-screen h-screen"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}

export default PublicWebsite;
