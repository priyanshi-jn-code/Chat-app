import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
  const { roomId } = useParams();  
  const [messages, setMessages] = useState(['Welcome User!']);
  const wsRef = useRef(null);
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);
      if (response.type === "chat" && response.roomId === roomId) {
        //@ts-ignore
        setMessages((prevMessages) => [
          ...prevMessages,
          response.payload.message, 
        ]);
      }
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: roomId },
        })
      );
    };

    //@ts-ignore
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center">
      <div className="h-[5vh] bg-white m-2 w-[500px] text-black font-semibold items-end">
        Room ID: {roomId}
      </div>
      <div className="h-[80vh] bg-white m-5 w-[500px] overflow-y-auto   ">
        {messages.map((message, index) => (
          <div key={index} className="bg-blue-700 text-black rounded p-2 w-[300px] m-4">
            {message}  
          </div>
        ))}
      </div>
      <div className="h-[5vh] bg-white m-5 w-[500px] flex justify-start border-1 border-red-200 items-center">
        <input
          ref={inputRef}
          type="text"
          className="text-black w-[400px] outline-none ml-2"
          placeholder="Type your message"
        />
        <button
          className="text-black bg-blue-700 border-2 border-black p-1 w-[100px] font-semibold"
          onClick={() => {
            const message = inputRef.current?.value;
            if (!message) return;
            //@ts-ignore
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );
            //@ts-ignore
            inputRef.current.value = ""; 
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
