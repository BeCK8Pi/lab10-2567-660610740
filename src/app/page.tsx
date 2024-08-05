"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { cleanUser } from "@/libs/cleanUser";
import UserCard from "@/components/UserCard";
import { UserCardProps } from "@/libs/types";

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState<UserCardProps[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState("1");

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;

    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    const got = users.map((x:any)=>cleanUser(x));
    //Then update state with function : setUsers(...)
    setUsers(got);
    console.log(got);
  };

  const [isFirstLoad,setIsFirstLoad] = useState(true);

  useEffect(()=>{
    if(isFirstLoad){
      setIsFirstLoad(false);
      return;
    }
    localStorage.setItem("getAmount",JSON.stringify(genAmount));
  },[genAmount])

  useEffect(()=>{
    const amount = localStorage.getItem("getAmount");
    if(amount){
      const gen = JSON.parse(amount);
      setGenAmount(gen);
    }
  },[])

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((x)=><UserCard key={x.name} name={x.name} imgUrl={x.imgUrl} address={x.address} email={x.email}/>)}
    </div>
  );
}
