<?php
function jsonSelect($items, $index) {
    if ($index >= 0 && $index < count($items)) {
        $result = json_encode($items[$index]);
        echo $result;
    } else {
        echo "Invalid Player index";
    }
}

class Player {
    public $username;
    public $win;
    public $lose;
    public $draw;
    public $totalGames;
    public $totalTime;

    public function __construct($username, $win, $lose, $draw, $totalGames, $totalTime) {
        $this->username = $username;
        $this->win = $win;
        $this->lose = $lose;
        $this->draw = $draw;
        $this->totalGames = $totalGames;
        $this->totalTime = $totalTime;
    }
}


// Assuming $items is your array of Digimon objects
$items = array(
    new Player("Horne",  81, 77, 6, 252, 880),
    new Player("Jackson", 168, 71, 8, 377, 1015),
    new Player("Cohen",  86, 118, 8, 290, 478),
    new Player("Macdonald",  30, 35, 3, 366, 2554),
    new Player("Stanton",  300, 123, 2, 273, 1492),
    new Player("Bauer",  20, 193, 5, 223, 2526),
    new Player("Holder",  200, 54, 7, 272, 1433)
);

$select = $_GET['getSelect'];
$counter = $_GET['getIndex'];

switch ($select) {
    case '0':
        jsonSelect($items, $counter);
        break;
}


// Assuming $items is your array of Digimon objects

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['index'])) {
        $index = $_GET['index'];

        if ($index >= 0 && $index < count($items)) {
            $digimon = $items[$index];
            echo json_encode($player);
        } else {
            echo "Invalid Digimon index";
        }
    } else {
        echo "Missing Player index parameter";
    }
} else {
    echo "Invalid request method";
}
?>


