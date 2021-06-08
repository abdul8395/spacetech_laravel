<?php
class Connection
{
   public $hostname = 'localhost';
     // public $hostname = '172.20.82.138';
    // public $port        = 5432;
    //public $database    = 'db_iris_portal';
    public $database    = 'pss1';
    public $username     = 'postgres';
    public $password     = '111';
   // public $password     = '123';
    public $conDB;

    public function connectionDB(){
        

        $this->conDB = pg_connect("host=$this->hostname dbname=$this->database user=$this->username password=$this->password");

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