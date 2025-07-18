import React from "react";
import Navbar from "../componants/navbar";
const Item = (props) => {
  const { header, pic, description } = props;
  return (
    <div className="font-mono text-black shadow-slate-900 hover:ease-in-out bg-gray-50 shadow-2xl rounded-lg text-center px-2 py-12 justify-center w-[400px] flex flex-col items-center">
      <h1 className="text-3xl font-mono font-bold justify-center drop-shadow-xl">
        {header}
      </h1>
      <img src={pic} alt="Logo" width={"300px"} className="my-4" />
      <p className="p-4">{description}</p>
    </div>
  );
};
export default function Dashboard() {
  return (
    <div>
      {/* Background Image */}
      <div>
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Background"
          className="absolute w-full"
        />
      </div>
      <div className="fixed z-10 w-full justify-end text-center pt-10 flex">
        <p className="w-auto text-lg flex text-gray-300 justify-start py-5 pl-10 pr-16 bg-blue-900">
          Designed by Danish Butt****
        </p>
      </div>
      {/* Welcome to the dashboard */}
      <div className="relative flex flex-col w-full items-center justify-center h-[60vh]">
        <h1 className="text-5xl text-white font-mono font-bold mt-20">
          Welcome to the Dashboard
        </h1>
        <p className="mt-5 text-gray-200 text-center">
          This is the Mern stack application with real chat and all basic
          features.
          <br />
          For the best experience, please use the latest version of Chrome or
          Firefox.
        </p>
      </div>
      {/* Navbar */}
      <div className="relative flex">
        <Navbar />
      </div>
      <div className="w-full justify-center flex ">
        <h1 className="relative text-3xl mt-10 bg-gray-800 px-5 py-1 rounded-lg border-double w-fit mx-20 shadow-lg text-gray-200">
          Features
        </h1>
      </div>
      {/* Items */}
      <div className="relative flex flex-row m-10 justify-around">
        <Item
          header={"Real Chat"}
          pic={"/pic.png"}
          description={
            "Hi this is real chat application i have build using socket.io"
          }
        />

        <Item
          header={"Todo list"}
          pic={"/pic.png"}
          description={
            "Hi this is todolist app page where i can manage my daily tasks & modify."
          }
        />

        <Item
          header={"Auth"}
          pic={"/pic.png"}
          description={"Hi this is session based authentication system."}
        />
      </div>
    </div>
  );
}
