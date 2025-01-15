import { useEffect, useRef, useState } from "react";

export default function CreateRoom() {
  const [messages, setMessages] = useState(["Welcome Creator!"]);
  const wsRef = useRef();
  const inputRef = useRef();

  const [roomId] = useState(() => {
    function generateRandomString(length = 10) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    return generateRandomString(); 
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (ev) => {
      const response = JSON.parse(ev.data);

      if (response.type === "chat" && response.roomId === roomId) {
        setMessages((m) => [...m, response.payload.message]);
      }
    };

    ws.onopen = () => {
    
      ws.send(
        JSON.stringify({
          type: "create",
          payload: {
            roomId: roomId, 
          },
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
      <div className="h-[80vh] bg-white m-5 w-[500px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className="bg-blue-700 text-black rounded p-2 w-[300px] m-4"
          >
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
                  roomId: roomId, 
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
