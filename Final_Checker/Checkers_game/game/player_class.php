<?php
class Player implements JsonSerializable{
    public $username;
    public $user_id;    //the pkey
    public $hints;
    public $win;
    public $lose;
    public $draw;
    public $total_games;
    public $total_time;

    public function __construct(){
        $this->username = generateRandomString();
        $this->password = generateRandomString();
        $this->user_id = 0;
        $this->hints = [];
        $this->win = 0;
        $this->lose = 0;
        $this->draw = 0;
        $this->total_games = 0;
        $this->total_time = 0;
    }

    // obj to str
    public function jsonSerialize() {
        return [
            'username' => $this->username,
            'user_id' => $this->user_id,
            'hints' => $this->hints,
            'win' => $this->win,
            'lose' => $this->lose,
            'draw' => $this->draw,
            'total_games' => $this->total_games,
            'total_time' => $this->total_time
            ];
    }
    
    // std obj -> movie Object
    public function Set($json){
        $this->user_name = $json['username'];
        $this->password = $json['password'];
        $this->user_id = $json['user_id'];
        $this->hints = $json['hints'];
        $this->win = $json['win'];
        $this->lose = $json['lose'];
        $this->draw = $json['draw'];
        $this->total_games = $json['total_games'];
        $this->total_time = $json['total_time'];
    }

    public function Display() {
        $v=json_encode($this);
        echo $v;
    }
    
    public function GetString() {
        return json_encode($this);
    }
}

function generateRandomString($length = 5) {
	// list of characters that can be present in the string
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

?>