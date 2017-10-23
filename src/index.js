const readline = require('readline');
var colors = require('colors');
var net = require('net');

var HOST = '127.0.0.1';
var PORT = 9000;
var client = null;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'You > '.green
});

rl.prompt();

rl.on('line', (line) => {
    switch (line) {
        case 'login': {
            OpenConnection();
            break;
        }
        default:
          console.log(`'${line}' is not a valid command.`);
          break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('You have left the chat room.');
    CloseConnection();
    process.exit(0);
});

function OpenConnection() {
    if(client) {
        console.log("--Connection is already open".red);
        setTimeout(function() {
            menu();
        }, 0);
        return;
    }

    client = new net.Socket();
    client.on("error", function(err) {
        client.destroy();
        client = null;
        console.log("ERROR: Connection could not be opened. Msg: %s".red, err.message);
        setTimeout(function() {
            menu();
        }, 0);
    });

    client.on("data", function(d) {
        console.log("%s".cyan, d);
    });

    client.connect(PORT, HOST, function() {
        console.log("Connection opened successfully!".green);
        rl.prompt();
    });

    client.on("close", function() {
        setTimeout(function() {
            menu();
        }, 0);
    });
};

function SendData(data) {
    if(!client) {
        console.log("ERROR: Connection is not opened.".red);
        // setTimeout(function() {
        //     menu();
        // }, 0);
        return;
    }

    client.write(data);
};

function CloseConnection() {
    if(!client) {
        console.log("ERROR: Connection is not opened.".red);
        setTimeout(function() {
            menu();
        }, 0);
        return;
    }
    client.destroy();
    client = null;
    console.log("Connection closed successfully.".yellow);
    setTimeout(function() {
        menu();
    }, 0);
};

function menu() {
    var lineRead = readLineSync.question("\r\n\r\nEnter Option (1 - Open, 2 - Send Data, 3 - Close, 4 - Quit): ");
    switch(lineRead) {
        case "1": {
            OpenConnection();
            break;
        }
        // case "2": {
        //     var data = readLineSync.question("Enter data to send: ");
        //     SendData(data);
        //     break;
        // }
        case "3": {
            CloseConnection();
            break;
        }
        case "4": {
            return;
            break;
        }
        default: {
            setTimeout(function() {
                menu();
            }, 0);
            break;
        }
    }
};

// setTimeout(function() {
//     menu();
// }, 0);