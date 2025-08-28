import { Snack } from "@/interfaces/snack";
import CenteredImageCard from "@/components/ui/profilecard";
import React, { useEffect, useState } from "react";
import Layout from "../core/layout";
import { SnackService } from "@/services/snack";
import { useAuth } from "@/context/useContext";
import { Loader } from "@/components/ui/loader";

const snackService = new SnackService();

function Menu() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Snack[]>([]);
  // const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [fetchUrl, setFetchUrl] = useState("");
  const [loading,setLoading]=useState(true)
  function fetchSnacks(){
    let data = snackService.getAll().then(response=>{
      setData(response)
      setLoading(false)
    })
  }


  useEffect(()=>{
    fetchSnacks()
  },[])

  // Fetch depuis une API si URL présente
  // useEffect(() => {
  //   // const fetchData = async () => {
  //   //   if (!fetchUrl || query.trim() === "") {
  //   //     setResults([]);
  //   //     return;
  //   //   }

  //   //   setLoading(true);
  //   //   try {
  //   //     const response = await fetch(`${fetchUrl}?q=${query}`);
  //   //     const json = await response.json();
  //   //     setResults(json);
  //   //   } catch (err) {
  //   //     console.error("Error fetching data:", err);
  //   //     setResults([]);
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // };
  //   // const debounceTimeout = setTimeout(fetchData, 300); // Debounce
  //   // return () => clearTimeout(debounceTimeout);
  // }, [query, fetchUrl]);

useEffect(()=>{
  
},[query])

  // Recherche dans la liste locale
  const filteredData = !fetchUrl
    ? data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : results;


    if (loading) {
    return (
      <Layout>
      <div className="h-[60vh] flex justify-center items-center">
        <Loader>
          <span className="text-black dark:text-white">
            Getting things ready…
          </span>
        </Loader>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="pt-10">
      <h1 className="text-center text-4xl mb-4">Snacks</h1>
      <div className="w-[30%] m-auto flex gap-1  justify-center items-center">
        <input
          type="text"
          placeholder={"search by name"}
          className="w-full px-4 py-2 border border-white rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
          <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
      </div>
      <div className="flex gap-2 md:w-[80%] flex-wrap justify-center  m-auto p-3">
        {filteredData.map((snack, index) => (
          <div className="cursor-pointer">
            <CenteredImageCard
              key={index}
              id={snack.id}
              img={snack.image}
              name={snack.name}
              bio={snack.description}
              skills={[]}
              githubUrl={undefined}
              twitterUrl={undefined}
              position={snack.address}
            />
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
}

export default Menu;
