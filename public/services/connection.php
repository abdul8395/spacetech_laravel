<?php
class Connection
{

    public $hostname = '172.20.82.138';
//    public $hostname = 'localhost';
    public $port        = 5432;
//    public $port        = 5433;
    public $database    = 'db_iris_portal';
    public $username     = 'postgres';
    public $password     = 'irisdiamondx';
//	 public $password     = 'diamondx';

    public $conDB;

    public function connectionDB(){

        $this->conDB = pg_connect("host=$this->hostname port=$this->port dbname=$this->database user=$this->username password=$this->password");

        if(!$this->conDB)
        {
            die("connection failed");
        }
    }
    public function closeConnection(){
        pg_close($this->conDB);
    }
}

$con = new Connection();
echo $con->connectionDB();
?>
