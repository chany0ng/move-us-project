import { useEffect } from "react";

const ChannelChatbot = () => {
  useEffect(() => {
    (function() {
      const w = window;
      if (w.ChannelIO) {
        return w.console.error("ChannelIO script included twice.");
      }
      const ch = function() { ch.c(arguments); };
      ch.q = [];
      ch.c = function(args) { ch.q.push(args); };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) return;
        w.ChannelIOInitialized = true;
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
        const x = document.getElementsByTagName("script")[0];
        if (x.parentNode) x.parentNode.insertBefore(s, x);
      }
      if (document.readyState === "complete") l();
      else {
        w.addEventListener("DOMContentLoaded", l);
        w.addEventListener("load", l);
      }
    })();

    // Initialize Channel.io with your plugin key
    window.ChannelIO('boot', {
      pluginKey: "fc6c5ff0-f7f4-429c-a47e-a47e75b5827c"
    });

    // Cleanup to unload the chatbot when the component unmounts
    return () => {
      window.ChannelIO('shutdown');
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default ChannelChatbot;