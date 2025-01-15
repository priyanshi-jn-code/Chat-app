import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";  

export default function JoinRoom() {
  const inputRef = useRef();
  const wsRef = useRef(null);
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [roomId, setRoomId] = useState(""); 
  const navigate = useNavigate();  

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);

      if (response.type === "success") {
        setError("");
        setSuccessMessage(response.message); 
        setRoomId(response.roomId); 
        navigate(`/room/${response.roomId}`); 
      } 
      else if (response.type === "error") {
        setSuccessMessage(""); 
        setError(response.message); 
      }
    };

    ws.onerror = () => {
      setError("Could not connect to the server.");
    };

    //@ts-ignore
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [navigate]); 

  const handleJoinRoom = () => {
    const enteredRoomId = inputRef.current?.value.trim();

    if (!enteredRoomId) {
      setError("Room ID cannot be empty");
      return;
    }

    setRoomId(enteredRoomId); 
    setError(""); 

    //@ts-ignore
    wsRef.current.send(
      JSON.stringify({
        type: "join",
        payload: {
          roomId: enteredRoomId,
        },
      })
    );
  };

  return (
    <div className="bg-black h-screen w-full flex justify-center items-center">
      {successMessage ? (
        <div className="text-white">
          <h1 className="text-2xl">Welcome to Room {roomId}!</h1>
        </div>
      ) : (
        <div className="bg-black flex flex-col rounded gap-2 h-[200px] w-[300px]">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter Room ID"
            className="outline-none border-2 mt-2 p-2"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            onClick={handleJoinRoom}
            className="bg-blue-700 text-black rounded p-2"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}


