<?php
namespace myTree;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Tree implements MessageComponentInterface {
	protected $clients;
    protected $tree;

	public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
    	$this->clients->attach($conn);
        //Read the tree stored in the file
        $msg = file_get_contents ('tree.txt');
        if ($msg){
            $conn->send($msg);
        }
    }

    public function onMessage(ConnectionInterface $from, $msg) {
    	foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);
                // Save state back to the file
                $fp = fopen('tree.txt', 'w');
                fwrite ($fp, $msg);
                fclose($fp);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
    	$this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
    	echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }
}