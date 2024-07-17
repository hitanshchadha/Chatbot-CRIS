class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })

    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        textField.value = ''; // Clear the input field immediately

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);
        this.updateChatText(chatbox);

        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-type': 'application/json'
            },
        })
            .then(r => {
                console.log('Response:', r);
                return r.json();
            })
            .then(r => {
                console.log('Parsed JSON:', r);
                let msg2 = { name: 'Sam', message: r.answer };
                this.messages.push(msg2);
                setTimeout(() => {
                    this.updateChatText(chatbox);
                }, 500); // 500ms delay
            })
            .catch((error) => {
                console.error('Error:', error);
                setTimeout(() => {
                    this.updateChatText(chatbox);
                }, 500); // 500ms delay
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.forEach(function (item) {
            if (item.name == "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages div');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();