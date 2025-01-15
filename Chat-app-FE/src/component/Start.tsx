import { useNavigate } from "react-router-dom";
export default function Start() {
const navigate = useNavigate()

  return (
    <div className="h-screen bg-black text-white flex ">
      <div className=" h-screen w-[50%] p-10 ">
        <div className=" w-[90%]">
        <h1 className="text-4xl font-bold mt-10">Hello, Welcome To Chat App!</h1>
        <h1 className="text-3xl mt-10 ">It is styled to make communication with multiple users at one time. </h1>
        <h1 className="text-2xl mt-10 ">Creating a better chat app for those people who want to do random chats.</h1>
        <h1 className="text-2xl mt-10 ">Its a temporarily chat app. </h1>
        <h1 className="text-2xl mt-10 ">Feel free as its Anonymous Chat App. </h1>


        </div>
      </div>
      <div className=" h-screen w-[50%]">
        <div className=" h-20 flex justify-end gap-10 items-center mt-10">
            <button className="bg-white text-black p-3 rounded" onClick={()=> navigate("/createRoom")}>Create Room</button>
            <button className="bg-white text-black p-3 rounded  mr-20" onClick={()=> navigate("/joinRoom")}>Join Room</button>
        </div>
      </div>
    </div>
  )
}
