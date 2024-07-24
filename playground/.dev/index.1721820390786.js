import { Button } from '@components/Button';

(function anonymous(server
) {
if (server.id) {
      const button = document.getElementById(server.id);
      button?.addEventListener("click", () => {
        console.log(server.logValue);
      });
    }
})({"id":"button-1","logValue":"1"});

(function anonymous(server
) {
if (server.id) {
      const button = document.getElementById(server.id);
      button?.addEventListener("click", () => {
        console.log(server.logValue);
      });
    }
})({"id":"button-2","logValue":"2"});

(function anonymous(server
) {
if (server.id) {
      const button = document.getElementById(server.id);
      button?.addEventListener("click", () => {
        console.log(server.logValue);
      });
    }
})({"id":"button-3","logValue":"3"});

