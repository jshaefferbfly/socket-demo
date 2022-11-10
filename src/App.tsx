import "./App.css";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

type Message = {
  origin: string;
  message: string;
};

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

function App() {
  const [clientCount, setClientCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.on("clientCountUpdate", (count: number) => {
      setClientCount(count);
    });
    socket.on("messageFromServer", (messages) => {
      const newMessages = [...messages];
      setMessages(newMessages);
    });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit("messageFromClient", message, socket.id);
    const newMessages = [{ origin: socket.id, message }, ...messages];
    setMessages(newMessages);
    setMessage("");
  };

  if (clientCount > 2) {
    return <div className="App">too many users, sorry</div>;
  } else {
    return (
      <div className="App">
        <div style={{ position: "relative" }}>
          <img
            src="/phone.png"
            alt="pixel art iphone"
            style={{
              zIndex: 0,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 300,
              right: 290,
              height: "370px",
              width: "298px",
              overflowY: "scroll",
              overflowWrap: "break-word",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {messages.map((m, i) => (
              <p
                key={i}
                style={{
                  fontSize: "14px",
                  color: "black",
                  textAlign: m.origin === socket.id ? "right" : "left",
                }}
              >
                {m.message}
              </p>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              style={{
                position: "absolute",
                right: 282,
                bottom: 226,
                fontFamily: "Silkscreen",
                padding: "14px",
                fontSize: "18px",
                width: "290px",
                backgroundColor: "#D3CECE",
                border: "none",
                borderTop: "2px solid black",
              }}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></input>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
